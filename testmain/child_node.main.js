const proc = require('child_process');

function testChildNode () {

    var argv = [];
    // argv = argv.concat('c:\\temp\\dir space\\file.txt');
    argv = argv.concat('/r');
    argv = argv.concat('c:/temp/dir space/file.txt'); // OK
    // argv = argv.concat('c:\\temp\\dir space\\file.txt'); // OK
    // argv = argv.concat('"c:\\temp\\dir space\\file.txt"'); // KO

    proc.execFile('sort', argv, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
        }
        console.log(stdout);
    });

    // proc.exec('sort /r "c:\\temp\\dir space\\file.txt"', (error, stdout, stderr) => {
    //     // 'sort /r c:/temp/dir space/file.txt'      => KO Command failed: sort /r c:/temp/dir space/file.txt
    //     // 'sort /r c:\\temp\\dir space\\file.txt'   => KO Command failed: sort /r c:\temp\dir space\file.txt
    //     // 'sort /r "c:\\temp\\dir space\\file.txt"' => OK
    //     if (error) {
    //         console.error(error);
    //     }
    //     console.log(stdout);
    // });
};

testChildNode();