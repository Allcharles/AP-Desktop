export function listAPCommands() {
    var python = require('child_process').spawn('AnalysisPrograms.exe', ['list']);
    python.stdout.on('data',function(data){
        console.log("data: ",data.toString('utf8'));
    });
}