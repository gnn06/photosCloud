const proc = require('child_process');

function testChildNode () {

    var argv = [];
    argv = argv.concat('/r');
    // argv = argv.concat('-r');
    // argv = argv.concat('e:/temp/dir space/file.txt');       // OK
    // argv = argv.concat('e:\\temp\\dir space\\file.txt');    // OK
    // argv = argv.concat('"e:\\temp\\dir space\\file.txt"');  // KO

    // argv = argv.concat('/tmp/dir space/file.txt');          // OK
    // argv = argv.concat('\\tmp\\dir space\\file.txt');       // OK
    // argv = argv.concat('"e:\\temp\\dir space\\file.txt"');  // KO

    proc.execFile('sort', argv, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
        }
        console.log(stdout);
    });

    // proc.exec(
        // 'sort /r e:/temp/dir space/file.txt'      //      => KO Command failed: sort /r c:\temp\dir space\file.txt
        // 'sort /r e:/temp/dir\ space/file.txt'      //      => KO Command failed: sort /r c:\temp\dir space\file.txt
        // 'sort /r e:/temp/dir\\ space/file.txt'      //      => KO Command failed: sort /r c:\temp\dir space\file.txt
        // 'sort /r e:\\temp\\dir space\\file.txt'      //      => KO Command failed: sort /r c:\temp\dir space\file.txt
        // 'sort /r e:\\temp\\dir\ space\\file.txt'      //      => KO
        // 'sort /r e:\\temp\\dir\\ space\\file.txt'      //      => KO
        // 'sort /r "e:\temp\dir space\file.txt"'        //      => KO
        // 'sort /r "e:\\temp\\dir space\\file.txt"'    //      => OK

        // 'sort -r /tmp/dir space/file.txt'         //      => KO Command failed: sort /r c:/temp/dir space/file.txt
        // 'sort -r /tmp/dir\ space/file.txt'        //      => KO
        // 'sort -r /tmp/dir\\ space/file.txt'       //      => OK
        // 'sort -r \\tmp\\dir space\\file.txt'      //      => KO Command failed: sort /r c:\temp\dir space\file.txt
        // 'sort -r "/tmp/dir space/file.txt"'       //      => OK
    //     ,(error, stdout, stderr) => {
    //     if (error) {
    //         console.error(error);
    //     }
    //     console.log(stdout);
    // });
};

testChildNode();
