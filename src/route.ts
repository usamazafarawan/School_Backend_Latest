export const routes = function (app: any): void {

    // app.use('/api/recordinfo', require('./api/recordInfo'));
    // app.use('/api/libraryinfo', require('./api/libraryInfo'));

    app.use('/api/test', (req, res) => res.send('BGS BACKEND'));


    app.use('/api/signUp', require('./api/signup'));
    app.use('/api/file', require('./api/uploadFeeStrucDoc'));
    app.use('/api/studentRecord', require('./api/studentRecord'));

    app.use('/api/studentAccount', require('./api/studentAccount'));


    // new code

    app.use('/api/auth', require('./api/signup'));






    
// SET STORAGE
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })
    // var upload = multer({ storage: storage });
    // app.post("/uploadFeeStrucDoc",upload.single('myImage'),(req,res)=>{
  //  console.log('req: ', req);
  //  var img = fs.readFileSync(req.file.path);
  //  var encode_img = img.toString('base64');
  //  var final_img = {
  //      contentType:req.file.mimetype,
  //      image:new Buffer(encode_img,'base64')
  //  };
  //  imageModel.create(final_img,function(err,result){
  //      if(err){
  //          console.log(err);
  //      }else{
  //          console.log(result.img.Buffer);
  //          console.log("Saved To database");
  //          res.contentType(final_img.contentType);
  //          res.send(final_img.image);
  //      }
  //  })
// })


    // /**
    //  * From here new Projects Api Starts Work
    //  */
    //  app.use('/api/teachersLogin', require('./api/Admin'));
    //  app.use('/api/teachersLogin', require('./api/QuizzData'));
    //  app.use('/api/teachersLogin', require('./api/StudentsSignup'));



  
  }