
export const uploadUrl = process.env.VUE_APP_BASE_HOST + '/api/multiMedia/upload'

export const hostUrl = process.env.VUE_APP_BASE_HOST

export function getCompleteUrl(url) {
    return hostUrl + '/' + url
}