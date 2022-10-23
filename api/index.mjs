import express from 'express';
import cors from 'cors';
import data from './data.mjs';
const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());



app.post('/projects', async (req, res) => {
  
  let searchquery = req.body.query || '';
  searchquery = searchquery.trimStart();
  if(searchquery == '') {
    return res.status(200).send(data);
  }
  searchquery = searchquery.toLowerCase();
  
  let result = [];
  data.forEach(el => {
    const project = Object.assign({}, el);
    const group = el.groups.filter((val)=> val.name.toLowerCase().includes(searchquery));
    project.groups = [];
    if(group.length > 0){
      project.groups = [...group]; 
      result.push(project); 
    }else if(project.name.toLowerCase().includes(searchquery)){
      result.push(project);
    }
    
    
  });

   return res.status(200).send(result);
});

app.listen(port, () => {
    console.log(`listening port ${port}`)
  });




