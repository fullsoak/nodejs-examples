import * as process from "node:process";
import * as path from "node:path";
import {
  type Context,
  Controller,
  Get,
  setupDefaultFullsoakLogger,
  ssr,
  useFullSoak,
} from "@fullsoak/fullsoak";
import { MyComponent } from "./components/MyComponent/index.tsx";
import { MyRouteAwareComponent } from "./components/MyRouteAwareComponent/index.tsx";

setupDefaultFullsoakLogger();

const GLOBAL_COMPONENTS_DIR: string =
  path.dirname(import.meta.url).replace("file://", "") +
  "/components";

@Controller()
class MyController {
  @Get("/")
  renderDynamicallyImportedComponent() {
    return ssr(MyComponent, { foo: "bar" });
  }

  @Get("/app/:page*")
  renderMyRouteAwareComponent(ctx: Context) {
    return ssr(MyRouteAwareComponent, {
      foo: "Lorem Ipsum",
      path: ctx.request.url.pathname,
    });
  }
}

const port = Number(process.env["PORT"]) || 3991;

useFullSoak({
  hostname: "0.0.0.0",
  port,
  controllers: [MyController],
  componentsDir: GLOBAL_COMPONENTS_DIR,
});
