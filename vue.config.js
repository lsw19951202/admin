module.exports = {
    devServer: {
        port: 8000
    },
    pages: {
        login: {
            entry: 'src/pages/login/main.ts',
            template: 'public/login.html',
            filename: 'login.html',
            title: '洋皮卷-登陆',
            favicon: 'public/favicon.ico'
        },
        index: {
            entry: 'src/pages/index/main.ts',
            template: 'public/index.html',
            filename: 'index.html',
            title: '云瞻数据中心',
            favicon: 'public/favicon.ico'
        }
    },
    css: {
        extract: false
    },
    publicPath: './',
    productionSourceMap: false,
    configureWebpack: config => {
        if(process.env.NODE_ENV === 'production'){
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
    }
}