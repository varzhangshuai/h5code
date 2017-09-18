var appServer = 'http://localhost:3000';
var bucket = 'daodao-upload';
var region = 'oss-cn-shanghai';
var urllib = OSS.urllib;
var OSS = OSS.Wrapper;
var STS = OSS.STS;
var applyTokenDo = function (func) {
    var url = appServer;
    return urllib.request(url, {
        method: 'GET'
    }).then(function (result) {
        var creds = JSON.parse(result.data);
        var client = new OSS({
            region: region,
            accessKeyId: creds.AccessKeyId,
            accessKeySecret: creds.AccessKeySecret,
            stsToken: creds.SecurityToken,
            bucket: bucket
        });
        return func(client);
    });
};
var progress = function (p) {
    return function (done) {
        var bar = document.getElementById('progress-bar');
        bar.style.width = Math.floor(p * 100) + '%';
        bar.innerHTML = Math.floor(p * 100) + '%';
        done();
    }
};
var uploadFile = function (client) {
    var file = document.getElementById('file').files[0];
    var key = document.getElementById('object-key-file').value.trim() || 'object';
    console.log(file.name + ' => ' + key);
    return client.multipartUpload(key, file, {
        progress: progress
    }).then(function (res) {
        console.log('upload success: %j', res);
        return listFiles(client);
    });
};
window.onload = function () {
    document.getElementById('file-button').onclick = function () {
        applyTokenDo(uploadFile);
    }
};