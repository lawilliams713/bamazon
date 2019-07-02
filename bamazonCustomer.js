var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start()   
  
});

function start(){
   // show list of product
   connection.query("SELECT * FROM products", function(error, res){
      // console.log(res)
       // for loop    (talbe with titules and lines for every produt) // npm cli-table
       for (var i = 0; i < res.length; i++) {
           if (parseInt(res[i].quantity) > 0){
                 console.log(res[i].id + " " + res[i].product_name + " " + res[i].price)
           }
       }
       askproduct();
   })

}

function askproduct(){
    inquirer
    .prompt([
      {
        name: "product",
        type: "input",
        message: "What product id?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many?"
      }
    ])
    .then(function(answer) {
      console.log(answer)
     //console.log(answer.product)
     // console.log(answer.quantity)
      var product = parseInt(answer.product)
      connection.query("SELECT * FROM products where id=" + product , function(error, res){
         console.log(res)
         if(res[0].quantity >= parseInt(answer.quantity)){
             // tell the user great we will send the product
            
             var newQ = res[0].quantity - parseInt(answer.quantity)
             connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    quantity: newQ
                  },
                  {
                    id: product
                  }
                ],
                function(error) {
                  if (error) throw err;
                  console.log("great we will send the package soon!");
                  start();
                }
              );
           
         }
         else{
             // sorry we have not enough ask other time for the askproduct
         }
        
     })

  
    });
}



// show list of products (done)
// you need to ask id / quantity (done)
// go to the db take a look if you have enough stock (done)
// if yes then sell  (done) or if not ask for other quntity 
// if you sell then you need to update the db (done)