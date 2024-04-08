const processId=document.querySelector('#id');
const processArrival=document.querySelector('#arrival');
const processBurst=document.querySelector('#burst');
const addButton=document.querySelector('.add');
const enterVisualization=document.querySelector('#enter');

var length=0;
let process=new Array();
addButton.addEventListener('click',(e)=>{
    e.preventDefault();
    newProcess();
});
function newProcess(){
    length++;
    const newNode=document.createElement("tr");
    process.push([Number(processId.value),Number(processArrival.value),Number(processBurst.value)])
    newNode.innerHTML=`<td style="border-right: 1px solid black">
    <div ><h2>${processId.value}</h2></div>
    </td>
    <td style="border-right: 1px solid black">
    <div><h2>${processArrival.value}</h2></div>
    </td>
    <td>
    <div><h2>${processBurst.value}</h2></div>
    </td>`;
    processId.value="";
    processArrival.value="";
    processBurst.value=""
    document.querySelector('.tableBody').insertAdjacentElement("beforeend",newNode);
}
enterVisualization.addEventListener('click',(e)=>{
    e.preventDefault();
    Visualization();
})

const cpu=document.querySelector('.cpuProcess');
function Visualization(){
    if(document.querySelector('select').value=="FCFS"){
        fcfs();
    }
    else  if(document.querySelector('select').value=="SJF"){
        sjf();
    }
    else if(document.querySelector('select').value=="LJF"){
        ljf();
    }
    
}
function processSort(process){
    for(let i=0;i<process.length;i++){
        for(let j=0;j<process.length;j++){
            if(process[i][1]<process[j][1]){
                let temp=process[i];
                process[i]=process[j];
                process[j]=temp;
            }
        }
    }
}
function readyQueueHandler(process,runningProcess,i,timeCount,readyQueueOccupied){
    for(let j=i+1;j<i+1+9;j++){
        if(process.length>j  && runningProcess[j][1]<=timeCount){
            document.getElementById(`${readyQueueOccupied}`).textContent=`${runningProcess[j][0]}`;
            readyQueueOccupied++;
        }
        else{
            document.getElementById(`${readyQueueOccupied}`).textContent='';
            readyQueueOccupied++;
        }
    }
}

const time=document.querySelector("#time");
let i=0;
let runningProcess=[];
let timeCount=0;
let readyQueueOccupied=0;
function fcfs(){ 
    processSort(process);
    runningProcess=process;
    timeCount=0;
    document.addEventListener('keydown',(e)=>{
        if(e.code=="ArrowRight"){
            if(i+1<=process.length){
                timeCount=timeCount+1;
                time.innerText=`${timeCount}`;
                readyQueueOccupied=1;
                if(timeCount>=runningProcess[i][1] && runningProcess[i][2]>0){
                    if(cpu.textContent==runningProcess[i][0]){
                        runningProcess[i][2]=runningProcess[i][2]-1;               
                    }
                    else{
                        cpu.textContent=`${runningProcess[i][0]}`;
                        
                    }
                }
                if(runningProcess[i][2]<=0){
                    if(i+1<runningProcess.length && runningProcess[i+1][1]<=timeCount){
                        i=i+1;
                        cpu.textContent=`${runningProcess[i][0]}`;
                    }
                    else {
                        if(i+1==runningProcess.length){i=i+1;}
                        cpu.textContent=``;
                    }
                }
                readyQueueHandler(process,runningProcess,i,timeCount,readyQueueOccupied);
            }
            else{
                timeCount=0;
                time.innerText=`${timeCount}`;
                process=[];
                runningProcess=[];
                cpu.textContent=``;
                for(let j=0;j<9;j++){
                    document.getElementById(`${j+1}`).textContent='';
                }
                location.reload();

            }
        }
        // 
    });
}
function runningProcessSort(runningProcess){
    for(let i=0;i<runningProcess.length;i++){
        for(let j=0;j<runningProcess.length;j++){
            if(runningProcess[i][2]<runningProcess[j][2]){
                let temp=runningProcess[i];
                runningProcess[i]=runningProcess[j];
                runningProcess[j]=temp;
            }
        }
    }
    return runningProcess;
}

let runningCount=0;
function readyQueueHandlerSJF(runningProcess,i,timeCount){
    for(let j=i+1;j<i+1+9;j++){
        if(j<runningProcess.length && runningProcess[j][1]<=timeCount){
            document.getElementById(`${j+1}`).textContent=`${runningProcess[j][0]}`;
            console.log(runningProcess[j][0]);
        }
        else{
            document.getElementById(`${j+1}`).textContent=``;
        }
    }
}


function sjf(){ 
    processSort(process);
    timeCount=0;
    let running=[,0,];
    runningProcess.sort((y,z)=>{
        return y[2]-z[2];   
    });
    i=0;
    document.addEventListener('keydown',(e)=>{
        if(e.code=="ArrowRight"){
            if(process.length>i){

                timeCount=timeCount+1;
                time.innerText=`${timeCount}`;

                //runningProcess filling with current tiumeCount processes
                while(runningCount<process.length && timeCount==process[runningCount][1]){
                    console.log(process[runningCount],"in while");
                    runningProcess.push(process[runningCount]);
                    console.log(runningProcess,"in while");
                    runningCount++;
                }
                if(runningProcess.length>1)
                    runningProcessSort(runningProcess);
                if(running[1]==0 && runningProcess.length>0){
                    running=runningProcess.shift();
                }

                //Dom Thing
                if(running[0]!=undefined || runningProcess.length!=0){
                    if(timeCount>=running[1] && running[2]>0){
                        if(cpu.textContent==running[0]){
                            running[2]=running[2]-1;             
                        }
                        else{                          
                            cpu.textContent=`${running[0]}`;
                        }
                    }
                    if(running[2]<1){
                        if(runningProcess.length>0){
                            running=runningProcess.shift();
                            cpu.textContent=`${running[0]}`;    
                        }
                        i++;      
                    }
                }
                else{
                    cpu.textContent=``;
                }
                readyQueueHandlerSJF(runningProcess,-1,timeCount);
            }
            else{
                timeCount=0;
                time.innerText=`${timeCount}`;
                process=[];
                runningProcess=[];
                cpu.textContent=``;
                for(let j=0;j<9;j++){
                    document.getElementById(`${j+1}`).textContent='';
                }
                location.reload();
            }
        }
    });
}

function runningProcessSortljf(runningProcess){
    for(let i=0;i<runningProcess.length;i++){
        for(let j=0;j<runningProcess.length;j++){
            if(runningProcess[i][2]>runningProcess[j][2]){
                let temp=runningProcess[i];
                runningProcess[i]=runningProcess[j];
                runningProcess[j]=temp;
            }
        }
    }
    return runningProcess;
}
function ljf(){ 
    processSort(process);
    timeCount=0;
    let running=[,0,];
    runningProcess.sort((y,z)=>{
        return y[2]-z[2];   
    });
    i=0;
    document.addEventListener('keydown',(e)=>{
        if(e.code=="ArrowRight"){
            if(process.length>i){

                timeCount=timeCount+1;
                time.innerText=`${timeCount}`;

                //runningProcess filling with current tiumeCount processes
                while(runningCount<process.length && timeCount==process[runningCount][1]){
                    runningProcess.push(process[runningCount]);
                    runningCount++;
                }
                if(runningProcess.length>1)
                    runningProcessSortljf(runningProcess);
                if(running[1]==0 && runningProcess.length>0){
                    running=runningProcess.shift();
                }

                //Dom Thing
                if(running[0]!=undefined || runningProcess.length!=0){
                    if(timeCount>=running[1] && running[2]>0){
                        if(cpu.textContent==running[0]){
                            running[2]=running[2]-1;             
                        }
                        else{                          
                            cpu.textContent=`${running[0]}`;
                        }
                    }
                    if(running[2]<1){
                        if(runningProcess.length>0){
                            running=runningProcess.shift();
                            cpu.textContent=`${running[0]}`;    
                        }
                        i++;      
                    }
                }
                else{
                    cpu.textContent=``;
                }
                readyQueueHandlerSJF(runningProcess,-1,timeCount);
            }
            else{
                timeCount=0;
                time.innerText=`${timeCount}`;
                process=[];
                runningProcess=[];
                cpu.textContent=``;
                for(let j=0;j<9;j++){
                    document.getElementById(`${j+1}`).textContent='';
                }
                location.reload();
            }
        }
    });
}
