import { Compiler, Stats } from 'webpack'
import Utils from './utils'

interface Options {
    /**
     * CSS style rules to be applied on console logs
     * 
     * default: ''
     */
    styles?: string
}

export class LogStylizerWebpackPlugin {
    styles: string

    constructor(options: Options = {}) {
        if (!Utils.isObject(options)) {
            throw new Error('log-stylizer-webpack-plugin only accepts options of type object.')
        }

        this.styles = options.styles || ''
    }

    apply(compiler: Compiler): void {
        const hooks = compiler.hooks
        if (hooks) {
            hooks.done.tap('log-stylizer-webpack-plugin', (stats: Stats) => {
                const outputPath = compiler.outputPath
                this.handleDone(stats, outputPath)
            })
        } else {
            throw new Error('log-stylizer-webpack-plugin supports webpack v4+.')
        }
    }

    handleDone(stats: Stats, outputPath: string): void {
        if (!stats) {
            throw new Error('log-stylizer-webpack-plugin supports webpack v4+.')
        }
        if (!outputPath) {
            throw new Error('No output path specified.')
        }

        /**
         * Get list of all the files in the output directory recursively
         */
        const distFiles = Utils.getAllFiles(outputPath)

        distFiles.forEach((filePath) => {
            Utils.stylizeLog(filePath, this.styles)
        })
    }
}

LogStylizerWebpackPlugin