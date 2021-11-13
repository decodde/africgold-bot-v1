
const Response = {
    success: (message, data, status) => {
        data ? data = data : data = "empty";
        var ret = {
            type: "success",
            msg: message,
            data: data,
            status: status
        }
        return ret;
    },
    error: (message, errors) => {
        errors ? errors = errors : errors = [];
        var ret = {
            type: "error",
            msg: message,
            errors: errors
        }
        return ret;
    }
}

exports.Response = Response;