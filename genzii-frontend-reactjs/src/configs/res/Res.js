

export default new class Res {
    errFromServer(status, data) {
        return {
            error: true,
            err_from_server: true,
            status: status,
            data: data
        }
    }
}