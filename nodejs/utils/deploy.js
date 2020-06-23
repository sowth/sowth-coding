const fs = require("fs");
const path = require("path");
const OSS = require("ali-oss");

async function deploy(DeployPath, OSSOptions, OSSClean) {
    console.log(DeployPath = path.resolve(DeployPath));
    if (!fs.statSync(DeployPath).isDirectory()) return;
    let client = new OSS(OSSOptions);
    let listFiles = (folder) => fs.readdirSync(folder).reduce((files, name) => {
        let file = path.join(folder, name);
        return files.concat(fs.statSync(file).isDirectory() ? listFiles(file) : file);
    }, []);
    let cleanOSS = () => client.list().then((res) => {
        let keys = res.objects ? res.objects.map((data) => data.name) : [];
        if (keys.length > 0) return client.deleteMulti(keys).then((res) => cleanOSS());
    });
    if (OSSClean) await cleanOSS();
    for (let file of listFiles(DeployPath)) {
        let key = file.substr(DeployPath.length + 1).split(path.sep).join("/");
        await client.multipartUpload(key, file).then((res) => console.log("√  " + key)).catch((error) => console.log("×  " + key));
    }
};

module.exports = deploy;