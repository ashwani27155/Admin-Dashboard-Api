const transactionController = require("../controllers/transaction.controller");
module.exports = (app) => {
	app.get("/api/v1/list_transaction",  transactionController.list_transaction);
	app.get("/api/v1/statistics",transactionController.statistics );
	app.get("/api/v1/bar_chart",transactionController.bar_chart );
	app.get("/api/v1/pie_chart",transactionController.pie_chart );
	app.get("/api/v1/all_static_data",transactionController.all_static_data );


};
