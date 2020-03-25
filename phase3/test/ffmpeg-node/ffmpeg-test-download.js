var AWS = require('aws-sdk');
var bucket = 'sas-noboru-upload';
var region = 'ap-northeast-1';
var key = 'uploads/tomono/1583559857.MOV';

var fs = require('fs');
const input = './input.MOV';

const ffmpeg = require('fluent-ffmpeg');
const count = 240;
const folder = './images/download';
const filename = 'image-%i.jpg';
const size = '800x600'

function getCredentials() {
    console.log('getCredentials');

    AWS.config.region = 'ap-northeast-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'ap-northeast-1:0ecf40ae-33d3-4458-8484-4dff06b70df2'
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

    var fileStream = fs.createWriteStream(input);
    var s3 = getS3Instance();
    var params = {
        Bucket: bucket,
        Key: key
    };
    s3Stream = s3.getObject(params).createReadStream();

    s3Stream.on('error', function(err) {
        console.log('getObject err: ' + err);
    });

    s3Stream.pipe(fileStream).on('error', function(err) {
        console.log('file stream err: ' + err);
    }).on('close', function() {
        console.log('success');

        const command = ffmpeg(input);
        command.screenshots({
            count: count,
            folder: folder,
            filename: filename,
            size: size
        });
    });
}

ffmpegTestDownload();
