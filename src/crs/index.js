const CRS=require('./CRS')
const CRS3857=require('./CRS3857')
const CRS4326=require('./CRS4326')
module.exports={
    CRS3857:new CRS3857(),
    CRS4326:new CRS4326()
}