import path from "path";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

export class ApiClient {
  private static _instance: ApiClient;
  public static get instance() {
    if (!ApiClient._instance) {
      ApiClient._instance = new ApiClient();
    }
    return ApiClient._instance;
  }

  private isReadyResolve: any;
  public isReady = new Promise((resolve) => {
    this.isReadyResolve = resolve;
  });

  public app: any;
  public router: any;

  constructor(overrideOptions?: any) {
    const config = Object.assign({
      host: process.env.HOST || '0.0.0.0',
      port: process.env.PORT || 5000,
      auth: {},
      swagger: {},
      routes: undefined,
      infoRoutes: process.env.INFO_ROUTES || false,
    }, overrideOptions || {});

    dotenv.config({
      path: path.join(process.cwd(), '.env'),
      override: true,
    });

    this.app = express();
    this.router = express.Router();

    this.initReqHandler(this.app, config);
    this.initMiddleware(this.app, config);
    
    this.app.listen({ host: config.host, port: config.port }, () => {
      console.log(`Server is running on port ${config.port}`);
      this.isReadyResolve();
    });
  }

  public async init() {
    console.debug("Api Client init");
    await this.isReady;
    console.debug("Api Client ready");
  }

  public initReqHandler(app: any, config: any) {
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    // Register routes
    if (config.routes) {
      const routes = new config.routes({
        router: this.router,
        infoRoutes: config.infoRoutes,
      });
      routes.init();
      app.use('/', routes.router);
    }
  }

  public initMiddleware(app: any, config: any) {
    app.use((err: any, req: any, res: any, next: any) => {
      console.error(`${req.method} ${req.url} - ${err.message}`);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    });

    app.use((req: any, res: any) => {
      res.status(404).json({
        status: "error",
        message: "Route not found",
      });
    });

    process.on('uncaughtException', (err: any) => {
      console.error(`Uncaught Exception: ${err.message}`);
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      console.error(`Unhandled Rejection: ${reason}`);
    });
  }
}
