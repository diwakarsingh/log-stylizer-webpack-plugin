import { readdirSync, lstatSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { LOG_IDENTIFIER } from './constants'

export function isObject(value: unknown): boolean {
    return typeof value === 'object' && value !== null
}

export function getAllFiles(outputPath: string): string[] {
    let res = []
    const files = readdirSync(outputPath)


    return files.reduce((allFiles: string[] = [], file: string) => {
        const filePath = outputPath + "/" + file

        /**
         * Synchronously return information about the symbolic link that is being used to refer to a file or directory
         */
        const stat = lstatSync(filePath)
        return stat.isDirectory()
            ? [...allFiles, ...getAllFiles(filePath)]
            : [...allFiles, filePath]
    }, [])
}

export function stylizeLog(filePath: string = '', styles: string = '') {
    if (!filePath) {
        throw new Error('Invalid file path to resolve.')
    }

    const fileSource = resolve(filePath)
    const logPattern = RegExp(`${LOG_IDENTIFIER}*`, 'g')

    let result = null
    let fileContent = readFileSync(fileSource, "utf8")

    while (result = logPattern.exec(fileContent)) {
        let charIndex = result.index
        while (fileContent.charAt(charIndex) !== ')') {
            charIndex++
        }
        const log = fileContent.substring(result.index + LOG_IDENTIFIER.length + 2, charIndex - 1)
        const preLogContent = fileContent.substring(0, result.index)
        const stylizedLog = `${LOG_IDENTIFIER}('%c ${log}','${styles}'`
        const postLogContent = fileContent.substr(charIndex)
        fileContent = preLogContent + stylizedLog + postLogContent
    }
    writeFileSync(fileSource, fileContent)
}