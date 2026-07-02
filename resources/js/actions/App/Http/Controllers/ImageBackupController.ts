import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ImageBackupController::diagnoseDiskSpace
 * @see app/Http/Controllers/ImageBackupController.php:558
 * @route '/api/image-backup/diagnostico/disk-space'
 */
export const diagnoseDiskSpace = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: diagnoseDiskSpace.url(options),
    method: 'get',
})

diagnoseDiskSpace.definition = {
    methods: ["get","head"],
    url: '/api/image-backup/diagnostico/disk-space',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImageBackupController::diagnoseDiskSpace
 * @see app/Http/Controllers/ImageBackupController.php:558
 * @route '/api/image-backup/diagnostico/disk-space'
 */
diagnoseDiskSpace.url = (options?: RouteQueryOptions) => {
    return diagnoseDiskSpace.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::diagnoseDiskSpace
 * @see app/Http/Controllers/ImageBackupController.php:558
 * @route '/api/image-backup/diagnostico/disk-space'
 */
diagnoseDiskSpace.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: diagnoseDiskSpace.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImageBackupController::diagnoseDiskSpace
 * @see app/Http/Controllers/ImageBackupController.php:558
 * @route '/api/image-backup/diagnostico/disk-space'
 */
diagnoseDiskSpace.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: diagnoseDiskSpace.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ImageBackupController::createBackup
 * @see app/Http/Controllers/ImageBackupController.php:26
 * @route '/api/image-backup/create'
 */
export const createBackup = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createBackup.url(options),
    method: 'post',
})

createBackup.definition = {
    methods: ["post"],
    url: '/api/image-backup/create',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageBackupController::createBackup
 * @see app/Http/Controllers/ImageBackupController.php:26
 * @route '/api/image-backup/create'
 */
createBackup.url = (options?: RouteQueryOptions) => {
    return createBackup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::createBackup
 * @see app/Http/Controllers/ImageBackupController.php:26
 * @route '/api/image-backup/create'
 */
createBackup.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createBackup.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImageBackupController::restoreBackup
 * @see app/Http/Controllers/ImageBackupController.php:58
 * @route '/api/image-backup/restore'
 */
export const restoreBackup = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restoreBackup.url(options),
    method: 'post',
})

restoreBackup.definition = {
    methods: ["post"],
    url: '/api/image-backup/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageBackupController::restoreBackup
 * @see app/Http/Controllers/ImageBackupController.php:58
 * @route '/api/image-backup/restore'
 */
restoreBackup.url = (options?: RouteQueryOptions) => {
    return restoreBackup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::restoreBackup
 * @see app/Http/Controllers/ImageBackupController.php:58
 * @route '/api/image-backup/restore'
 */
restoreBackup.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restoreBackup.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImageBackupController::listBackups
 * @see app/Http/Controllers/ImageBackupController.php:87
 * @route '/api/image-backup/list'
 */
export const listBackups = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listBackups.url(options),
    method: 'get',
})

listBackups.definition = {
    methods: ["get","head"],
    url: '/api/image-backup/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImageBackupController::listBackups
 * @see app/Http/Controllers/ImageBackupController.php:87
 * @route '/api/image-backup/list'
 */
listBackups.url = (options?: RouteQueryOptions) => {
    return listBackups.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::listBackups
 * @see app/Http/Controllers/ImageBackupController.php:87
 * @route '/api/image-backup/list'
 */
listBackups.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listBackups.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImageBackupController::listBackups
 * @see app/Http/Controllers/ImageBackupController.php:87
 * @route '/api/image-backup/list'
 */
listBackups.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listBackups.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ImageBackupController::downloadBackup
 * @see app/Http/Controllers/ImageBackupController.php:108
 * @route '/api/image-backup/{backupName}/download'
 */
export const downloadBackup = (args: { backupName: string | number } | [backupName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBackup.url(args, options),
    method: 'get',
})

downloadBackup.definition = {
    methods: ["get","head"],
    url: '/api/image-backup/{backupName}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImageBackupController::downloadBackup
 * @see app/Http/Controllers/ImageBackupController.php:108
 * @route '/api/image-backup/{backupName}/download'
 */
downloadBackup.url = (args: { backupName: string | number } | [backupName: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { backupName: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    backupName: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        backupName: args.backupName,
                }

    return downloadBackup.definition.url
            .replace('{backupName}', parsedArgs.backupName.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::downloadBackup
 * @see app/Http/Controllers/ImageBackupController.php:108
 * @route '/api/image-backup/{backupName}/download'
 */
downloadBackup.get = (args: { backupName: string | number } | [backupName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBackup.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImageBackupController::downloadBackup
 * @see app/Http/Controllers/ImageBackupController.php:108
 * @route '/api/image-backup/{backupName}/download'
 */
downloadBackup.head = (args: { backupName: string | number } | [backupName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadBackup.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ImageBackupController::getFolderSizes
 * @see app/Http/Controllers/ImageBackupController.php:196
 * @route '/api/image-backup/folder/sizes'
 */
export const getFolderSizes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFolderSizes.url(options),
    method: 'get',
})

getFolderSizes.definition = {
    methods: ["get","head"],
    url: '/api/image-backup/folder/sizes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImageBackupController::getFolderSizes
 * @see app/Http/Controllers/ImageBackupController.php:196
 * @route '/api/image-backup/folder/sizes'
 */
getFolderSizes.url = (options?: RouteQueryOptions) => {
    return getFolderSizes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::getFolderSizes
 * @see app/Http/Controllers/ImageBackupController.php:196
 * @route '/api/image-backup/folder/sizes'
 */
getFolderSizes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFolderSizes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImageBackupController::getFolderSizes
 * @see app/Http/Controllers/ImageBackupController.php:196
 * @route '/api/image-backup/folder/sizes'
 */
getFolderSizes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getFolderSizes.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ImageBackupController::createFolderBackup
 * @see app/Http/Controllers/ImageBackupController.php:227
 * @route '/api/image-backup/folder/backup'
 */
export const createFolderBackup = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createFolderBackup.url(options),
    method: 'post',
})

createFolderBackup.definition = {
    methods: ["post"],
    url: '/api/image-backup/folder/backup',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageBackupController::createFolderBackup
 * @see app/Http/Controllers/ImageBackupController.php:227
 * @route '/api/image-backup/folder/backup'
 */
createFolderBackup.url = (options?: RouteQueryOptions) => {
    return createFolderBackup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::createFolderBackup
 * @see app/Http/Controllers/ImageBackupController.php:227
 * @route '/api/image-backup/folder/backup'
 */
createFolderBackup.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createFolderBackup.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImageBackupController::downloadFolderBackup
 * @see app/Http/Controllers/ImageBackupController.php:253
 * @route '/api/image-backup/folder/download'
 */
export const downloadFolderBackup = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: downloadFolderBackup.url(options),
    method: 'post',
})

downloadFolderBackup.definition = {
    methods: ["post"],
    url: '/api/image-backup/folder/download',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageBackupController::downloadFolderBackup
 * @see app/Http/Controllers/ImageBackupController.php:253
 * @route '/api/image-backup/folder/download'
 */
downloadFolderBackup.url = (options?: RouteQueryOptions) => {
    return downloadFolderBackup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::downloadFolderBackup
 * @see app/Http/Controllers/ImageBackupController.php:253
 * @route '/api/image-backup/folder/download'
 */
downloadFolderBackup.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: downloadFolderBackup.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImageBackupController::restoreFolderBackup
 * @see app/Http/Controllers/ImageBackupController.php:295
 * @route '/api/image-backup/folder/restore'
 */
export const restoreFolderBackup = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restoreFolderBackup.url(options),
    method: 'post',
})

restoreFolderBackup.definition = {
    methods: ["post"],
    url: '/api/image-backup/folder/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageBackupController::restoreFolderBackup
 * @see app/Http/Controllers/ImageBackupController.php:295
 * @route '/api/image-backup/folder/restore'
 */
restoreFolderBackup.url = (options?: RouteQueryOptions) => {
    return restoreFolderBackup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::restoreFolderBackup
 * @see app/Http/Controllers/ImageBackupController.php:295
 * @route '/api/image-backup/folder/restore'
 */
restoreFolderBackup.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restoreFolderBackup.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImageBackupController::uploadBackup
 * @see app/Http/Controllers/ImageBackupController.php:512
 * @route '/api/image-backup/upload'
 */
export const uploadBackup = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadBackup.url(options),
    method: 'post',
})

uploadBackup.definition = {
    methods: ["post"],
    url: '/api/image-backup/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageBackupController::uploadBackup
 * @see app/Http/Controllers/ImageBackupController.php:512
 * @route '/api/image-backup/upload'
 */
uploadBackup.url = (options?: RouteQueryOptions) => {
    return uploadBackup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::uploadBackup
 * @see app/Http/Controllers/ImageBackupController.php:512
 * @route '/api/image-backup/upload'
 */
uploadBackup.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadBackup.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImageBackupController::getDiskSpace
 * @see app/Http/Controllers/ImageBackupController.php:326
 * @route '/api/image-backup/disk-space'
 */
export const getDiskSpace = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDiskSpace.url(options),
    method: 'get',
})

getDiskSpace.definition = {
    methods: ["get","head"],
    url: '/api/image-backup/disk-space',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImageBackupController::getDiskSpace
 * @see app/Http/Controllers/ImageBackupController.php:326
 * @route '/api/image-backup/disk-space'
 */
getDiskSpace.url = (options?: RouteQueryOptions) => {
    return getDiskSpace.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::getDiskSpace
 * @see app/Http/Controllers/ImageBackupController.php:326
 * @route '/api/image-backup/disk-space'
 */
getDiskSpace.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDiskSpace.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImageBackupController::getDiskSpace
 * @see app/Http/Controllers/ImageBackupController.php:326
 * @route '/api/image-backup/disk-space'
 */
getDiskSpace.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDiskSpace.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ImageBackupController::startChunkedUpload
 * @see app/Http/Controllers/ImageBackupController.php:346
 * @route '/api/image-backup/chunked/start'
 */
export const startChunkedUpload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startChunkedUpload.url(options),
    method: 'post',
})

startChunkedUpload.definition = {
    methods: ["post"],
    url: '/api/image-backup/chunked/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageBackupController::startChunkedUpload
 * @see app/Http/Controllers/ImageBackupController.php:346
 * @route '/api/image-backup/chunked/start'
 */
startChunkedUpload.url = (options?: RouteQueryOptions) => {
    return startChunkedUpload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::startChunkedUpload
 * @see app/Http/Controllers/ImageBackupController.php:346
 * @route '/api/image-backup/chunked/start'
 */
startChunkedUpload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startChunkedUpload.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImageBackupController::uploadChunk
 * @see app/Http/Controllers/ImageBackupController.php:396
 * @route '/api/image-backup/chunked/upload'
 */
export const uploadChunk = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadChunk.url(options),
    method: 'post',
})

uploadChunk.definition = {
    methods: ["post"],
    url: '/api/image-backup/chunked/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageBackupController::uploadChunk
 * @see app/Http/Controllers/ImageBackupController.php:396
 * @route '/api/image-backup/chunked/upload'
 */
uploadChunk.url = (options?: RouteQueryOptions) => {
    return uploadChunk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::uploadChunk
 * @see app/Http/Controllers/ImageBackupController.php:396
 * @route '/api/image-backup/chunked/upload'
 */
uploadChunk.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadChunk.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImageBackupController::finishChunkedUpload
 * @see app/Http/Controllers/ImageBackupController.php:436
 * @route '/api/image-backup/chunked/finish'
 */
export const finishChunkedUpload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finishChunkedUpload.url(options),
    method: 'post',
})

finishChunkedUpload.definition = {
    methods: ["post"],
    url: '/api/image-backup/chunked/finish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageBackupController::finishChunkedUpload
 * @see app/Http/Controllers/ImageBackupController.php:436
 * @route '/api/image-backup/chunked/finish'
 */
finishChunkedUpload.url = (options?: RouteQueryOptions) => {
    return finishChunkedUpload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::finishChunkedUpload
 * @see app/Http/Controllers/ImageBackupController.php:436
 * @route '/api/image-backup/chunked/finish'
 */
finishChunkedUpload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finishChunkedUpload.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImageBackupController::getChunkedUploadStatus
 * @see app/Http/Controllers/ImageBackupController.php:465
 * @route '/api/image-backup/chunked/status'
 */
export const getChunkedUploadStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getChunkedUploadStatus.url(options),
    method: 'get',
})

getChunkedUploadStatus.definition = {
    methods: ["get","head"],
    url: '/api/image-backup/chunked/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImageBackupController::getChunkedUploadStatus
 * @see app/Http/Controllers/ImageBackupController.php:465
 * @route '/api/image-backup/chunked/status'
 */
getChunkedUploadStatus.url = (options?: RouteQueryOptions) => {
    return getChunkedUploadStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::getChunkedUploadStatus
 * @see app/Http/Controllers/ImageBackupController.php:465
 * @route '/api/image-backup/chunked/status'
 */
getChunkedUploadStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getChunkedUploadStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImageBackupController::getChunkedUploadStatus
 * @see app/Http/Controllers/ImageBackupController.php:465
 * @route '/api/image-backup/chunked/status'
 */
getChunkedUploadStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getChunkedUploadStatus.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ImageBackupController::cancelChunkedUpload
 * @see app/Http/Controllers/ImageBackupController.php:487
 * @route '/api/image-backup/chunked/cancel'
 */
export const cancelChunkedUpload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelChunkedUpload.url(options),
    method: 'post',
})

cancelChunkedUpload.definition = {
    methods: ["post"],
    url: '/api/image-backup/chunked/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ImageBackupController::cancelChunkedUpload
 * @see app/Http/Controllers/ImageBackupController.php:487
 * @route '/api/image-backup/chunked/cancel'
 */
cancelChunkedUpload.url = (options?: RouteQueryOptions) => {
    return cancelChunkedUpload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::cancelChunkedUpload
 * @see app/Http/Controllers/ImageBackupController.php:487
 * @route '/api/image-backup/chunked/cancel'
 */
cancelChunkedUpload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelChunkedUpload.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ImageBackupController::getBackupInfo
 * @see app/Http/Controllers/ImageBackupController.php:167
 * @route '/api/image-backup/{backupName}'
 */
export const getBackupInfo = (args: { backupName: string | number } | [backupName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getBackupInfo.url(args, options),
    method: 'get',
})

getBackupInfo.definition = {
    methods: ["get","head"],
    url: '/api/image-backup/{backupName}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImageBackupController::getBackupInfo
 * @see app/Http/Controllers/ImageBackupController.php:167
 * @route '/api/image-backup/{backupName}'
 */
getBackupInfo.url = (args: { backupName: string | number } | [backupName: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { backupName: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    backupName: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        backupName: args.backupName,
                }

    return getBackupInfo.definition.url
            .replace('{backupName}', parsedArgs.backupName.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::getBackupInfo
 * @see app/Http/Controllers/ImageBackupController.php:167
 * @route '/api/image-backup/{backupName}'
 */
getBackupInfo.get = (args: { backupName: string | number } | [backupName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getBackupInfo.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImageBackupController::getBackupInfo
 * @see app/Http/Controllers/ImageBackupController.php:167
 * @route '/api/image-backup/{backupName}'
 */
getBackupInfo.head = (args: { backupName: string | number } | [backupName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getBackupInfo.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ImageBackupController::deleteBackup
 * @see app/Http/Controllers/ImageBackupController.php:133
 * @route '/api/image-backup/{backupName}'
 */
export const deleteBackup = (args: { backupName: string | number } | [backupName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteBackup.url(args, options),
    method: 'delete',
})

deleteBackup.definition = {
    methods: ["delete"],
    url: '/api/image-backup/{backupName}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ImageBackupController::deleteBackup
 * @see app/Http/Controllers/ImageBackupController.php:133
 * @route '/api/image-backup/{backupName}'
 */
deleteBackup.url = (args: { backupName: string | number } | [backupName: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { backupName: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    backupName: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        backupName: args.backupName,
                }

    return deleteBackup.definition.url
            .replace('{backupName}', parsedArgs.backupName.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImageBackupController::deleteBackup
 * @see app/Http/Controllers/ImageBackupController.php:133
 * @route '/api/image-backup/{backupName}'
 */
deleteBackup.delete = (args: { backupName: string | number } | [backupName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteBackup.url(args, options),
    method: 'delete',
})
const ImageBackupController = { diagnoseDiskSpace, createBackup, restoreBackup, listBackups, downloadBackup, getFolderSizes, createFolderBackup, downloadFolderBackup, restoreFolderBackup, uploadBackup, getDiskSpace, startChunkedUpload, uploadChunk, finishChunkedUpload, getChunkedUploadStatus, cancelChunkedUpload, getBackupInfo, deleteBackup }

export default ImageBackupController