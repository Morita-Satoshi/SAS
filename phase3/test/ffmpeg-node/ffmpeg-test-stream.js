var AWS = require('aws-sdk');
var bucket = 'sas-noboru-upload';
var region = 'ap-northeast-1';
var key = 'uploads/tomono/1583559857.MOV';
var expires = 600;

const ffmpeg = require('fluent-ffmpeg');
const count = 240;
const folder = './images/stream';
const filename = 'image-%i.jpg';
const size = '800x600'

function getCredentials() {
    console.log('getCredentials');

    AWS.config.region = 'ap-northeast-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: ''
    });
}

function getS3Instance() {
    console.log('getS3Instance');

    return new AWS.S3({
        param: {
            Bucket: bucket,
            Region: region
        }
    });
}

function ffmpegTestDownload() {
    console.log('ffmpegTestDownload');

    getCredentials();

    var s3 = getS3Instance();
    var params = {
        Bucket: bucket,
        Key: key,
        Expires: expires
    };

    const signedUrl = s3.getSignedUrl(
        "getObject",
        params,
        (err, signedUrl) => {
            if (err) {
                console.log('getSignedUrl err: ' + err);
            }
            else {
                console.log('getSignedUrl success: ' + signedUrl);
                const command = ffmpeg(signedUrl);
                command.screenshots({
                    count: count,
                    folder: folder,
                    filename: filename,
                    size: size
                });
            }
        }
    );
}

ffmpegTestDownload();
