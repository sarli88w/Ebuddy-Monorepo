import fs from "fs";
import path from "path";

export class Routes {
  private static _instance: Routes;
  public static get instance() {
    if (!Routes._instance) {
      Routes._instance = new Routes();
    }
    return Routes._instance;
  }

  private isReadyResolve: any;
  public isReady = new Promise((resolve) => {
    this.isReadyResolve = resolve;
  });

  public router: any;

  constructor(overrideOptions?: any) {
    const config = Object.assign({
      router: {},
      baseDir: 'api',
      infoRoutes: false,
    }, overrideOptions || {});

    this.router = config.router;

    this.initDirCors(this.router, config);
    this.initDirRoute(this.router, config).then(() => {
      this.isReadyResolve();
    });
  }

  public async init() {
    console.debug("Routes init");
    await this.isReady;
    console.debug("Routes ready");
  }

  public initDirCors(router: any, config: any) {
    router.all(`/${config.baseDir}/*`, (req: any, res: any, next: any) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      next();
    })
  }

  public async initDirRoute(router: any, config: any) {
    try {
      const files = await fs.promises.readdir(path.join(__dirname, "./"));
      for (const file of files) {
        if (/Routes\.(ts|js)$/.test(file)) {
          const routeName = file.replace(/Routes\.(ts|js)$/, "").toLowerCase();
          const routePath = `/${config.baseDir}/${routeName}`;
          try {
            const routeModule = await import(path.resolve(__dirname, `./${file}`));
            if (typeof routeModule.default == "function") {
              router.use(routePath, routeModule.default(router));
              if (config.infoRoutes) {
                console.info(`✔ Loaded route: ${routePath}`);
              }
            } else {
              console.error(`Route ${file} does not export a default function`);
            }
          } catch (err: any) {
            console.error(`Error loading route ${file}: ${err.message}`);
          }
        }
      }
    } catch (err: any) {
      console.error(`Error reading routes directory: ${err.message}`);
    }
  }
}