const path = require('path');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

// dom render:
const renderDom = (str, fn) =>  {
    document.getElementById(str).innerText = fn;
}

const notifyApp = (options) => {
    new Notification(options.title, options);
}

let cpuOverload = 80;

notifyApp({
    title: 'Cpu Overload',
    body: `Cpu is Over ${cpuOverload}`
});

// run every 2 second:
setInterval(() => {
    cpu.usage().then( info => {
        renderDom('cpu-usage',info + ' %');
        document.getElementById('cpu-progress').style.width = info+'%';
        if(info >= cpuOverload ) {
            document.getElementById('cpu-progress').style.background = 'red';
        } else {
            document.getElementById('cpu-progress').style.background = 'green';
        }
    });
    cpu.free().then( info => {
        renderDom('cpu-free', info + ' %');
    });
    
},2000);

renderDom('cpu-model', cpu.model());
renderDom('comp-name', os.hostname());
renderDom('os',`${os.type()} | ${os.arch()}`);

mem.info().then( info => {
    renderDom('mem-total', Math.round(info.totalMemMb/1000) + ' mb');
    // console.log(info);
});