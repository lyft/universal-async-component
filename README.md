# Universal Async Component

Async component that works in server and client. It will allows code splitting that works for universal apps.

## What is this?
This is solving the [hard problem](hard-problem) of mixing code splitting and server side rendering. To avoid "flash" of contents in the initial load server should include dynamic chunks required to render the initial screen.

## Usage

```js
import { getComponentAsync } from 'universal-async-component';

const AsyncHelloWorld = getComponentAsync({ loader: () => import('./hello') });

const App = () => <AsyncHelloWorld />
```

## Server side rendering

### 1. Add `CaptureChunks`
Wrap you app with `CaptureChunks` in your server renderer. You need to provide Webpack client side stats to it. Also, pass an empty array

```jsx
const additionalChunks = [];
var htmlString = ReactDOM.renderToString(
    <CaptureChunks statsChunks={clientStats.chunks} additionalChunks={additionalChunks}>
        <App />
    </CaptureChunks>
);
```
After above code is run, `additionalChunks` is populated with all chunkIds that is required to render current `App`.

### 2. Use `additionalChunks`
Use `additionalChunks` retrieved from `CaptureChunks` to append required chunks

```js
res.send(`
<html>
    <body>
        <div id="root">${htmlString}</div>
        <script src="webpack-bootstrap.js"></script>
        ${additionalChunks.map(chunkId => `<script src="${chunksId}.client.js"></script>`)}
        <script src="client.js"></script>
    </body>
</html>
`)
```
Note that additional chunks must come before the main bundle and after Webpack bootstrap script. It's easy to extract out Webpack bootstrap by using `CommonsChunkPlugin` plugin:

```js
new webpack.optimize.CommonsChunkPlugin({
    names: ['bootstrap'],
    filename: 'webpack-bootstrap.js',
    minChunks: Infinity
}),
```

### 3. Add `"string-replace-loader"`
Add `"string-replace-loader"` before any of other loaders in your Webpack config and require options from `"universal-async-component"`:

```js
const { stringReplaceLoaderOptions } = require('universal-async-component');
const config = {
    rules: [
        test: /\.jsx?/,
        use: {
            loader: "string-replace-loader",
            options: stringReplaceLoaderOptions,
        },
    ],
}
```




[hard-problem]: [https://github.com/ReactTraining/react-router/blob/d64ed0150b41df02b083f090b6682261c819a91e/packages/react-router-dom/docs/guides/code-splitting.md#code-splitting--server-rendering]
