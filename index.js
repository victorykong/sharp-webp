const Koa = require("koa");
const app = new Koa();
const sharp = require("sharp");
const fs = require("fs");

app.use(require("koa-static")(__dirname));

const isImage = (url) => {
  if (!url) return false;
  return /\.(png|svg|jpg|jpeg|gif)$/i.test(url);
};

// webp
app.use(async (ctx, next) => {
  try {
    if (ctx.request.method.toLocaleLowerCase() === "get" && isImage(ctx.href)) {
      const img = fs.createReadStream("./img.png");
      const webp = sharp().webp({ quality: 100 });

      // long time ...
      //   const { size } = await webp.metadata();
      //   console.log(size);

      const body = img.pipe(webp);
      ctx.set("Content-Type", "image/webp");
      ctx.body = body;
      return;
    }

    next();
  } catch (err) {
    const { response } = err || {};
    const { statusText, status } = response || {};
    ctx.body = statusText || "Server Error";
    ctx.status = status || 500;
  }
});

// app.use((ctx) => {
//   ctx.body = "Hello Koa 2";
// });

app.listen(3000);
