const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const source=html.match(/function cleanAiSuggestion[\s\S]*?(?=async function reviewText)/)[0];
const clean=vm.runInNewContext(source+';cleanAiSuggestion');
for(const prefix of ['Section of Performance: ','Section of Performance.\n','Performance\n','Team Performance: ','**Team Performance**\n','### Team Performance\n','Performance section: ','Section: Performance: ']){
 test('removes leading label '+JSON.stringify(prefix),()=>assert.equal(clean(prefix+'The team worked well.','performance'),'The team worked well.'));
}
test('other report sections',()=>{
 for(const [field,label] of [['facts','Daily Facts'],['maintenance','Maintenance'],['flowNote','Business Flow'],['staff','Staff Updates']])assert.equal(clean(label+': Rewritten text.',field),'Rewritten text.');
});
test('preserves ordinary sentences and labels inside the report',()=>{
 for(const text of ['Performance improved today.','The performance section was reviewed.','The team worked well.\nPerformance: improved.','Maintenance: repaired.'])assert.equal(clean(text,'performance'),text);
});
test('heading-only response is empty and rejected by caller',()=>assert.equal(clean('Section of Performance:','performance'),''));
test('inline app script parses',()=>new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]));
