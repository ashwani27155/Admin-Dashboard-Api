
const axios = require('axios');
const moment = require('moment');
// Api for get url data based on given condition
exports.list_transaction = async (req, res) => {
	try {
        const apiUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

        // Pagination parameters
        const page = parseInt(req.body.page) || 1;
        const perPage = parseInt(req.body.perPage) || 10;
        const skip = (page - 1) * perPage;

        // Search parameter
        const search = req.body.search || '';

        // Make the API request for getting api data
        const response = await axios.get(apiUrl);
        const data = response.data;

        // Apply search based on title, description, and price
        let filteredData = data;
        if (search) {
			//If there is search then return data according to it
            filteredData = data.filter(item =>
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.description.toLowerCase().includes(search.toLowerCase()) ||
                item.price.toString().includes(search)
            );
        }
		else{
			// If there is no search value then return whole data
			filteredData = data.filter(item =>
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.description.toLowerCase().includes(search.toLowerCase()) ||
                item.price.toString().includes(search)
            );
		}

        // Apply pagination
        const paginatedData = filteredData.slice(skip, skip + perPage);

        res.status(200).json({
            message: "API data fetched successfully",
            status: "true",
            pagination: {
                page,
                perPage,
                totalItems: filteredData.length,
            },
            apiData: paginatedData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching API data",
            status: "false",
            error: error.message,
        });
    }
}

//Find statistics data by given month
exports.statistics = async (req, res) => {
	try {
		const selectedMonth = req.body.selectedMonth;
		const selectedMonthStart = moment(selectedMonth, 'YYYY-MM').startOf('month');
		const selectedMonthEnd = moment(selectedMonth, 'YYYY-MM').endOf('month');
		const apiUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
		const response = await axios.get(apiUrl);
        const data = response.data;

		// Filter products based on the selected month
		const filteredProducts = data.filter(product => {
		  const saleDate = moment(product.dateOfSale);
		  return saleDate.isBetween(selectedMonthStart, selectedMonthEnd, null, '[]');
		});
	
		// Calculate statistics
		const totalSaleAmount = filteredProducts.reduce((total, product) => total + product.price, 0);
		const totalSoldItems = filteredProducts.filter(product => product.sold).length;
		const totalNotSoldItems = filteredProducts.filter(product => !product.sold).length;
	
		res.status(200).json({
		  message:"Data fetch Successfully",
		  status:"success",
		  selectedMonth,
		  totalSaleAmount,
		  totalSoldItems,
		  totalNotSoldItems,
		});
	  } catch (error) {
		console.error(error);
		res.status(500).json({
		  message: "Error calculating statistics",
		  error: error.message,
		});
	  }
};

//Api for bar Chart
exports.bar_chart = async (req, res) => {
	try {
		const apiUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
		const response = await axios.get(apiUrl);
        const data = response.data;
		const selectedMonth = req.body.selectedMonth;
		const selectedMonthStart = moment(selectedMonth, 'YYYY-MM').startOf('month');
		const selectedMonthEnd = moment(selectedMonth, 'YYYY-MM').endOf('month');
	
		// Filter products based on the selected month
		const filteredProducts = data.filter(product => {
			const saleDate = moment(product.dateOfSale);
			return saleDate.isBetween(selectedMonthStart, selectedMonthEnd, null, '[]');
		  });
		// Define price ranges
		const priceRanges = [
		  { min: 0, max: 100 },
		  { min: 101, max: 200 },
		  { min: 201, max: 300 },
		  { min: 301, max: 400 },
		  { min: 401, max: 500 },
		  { min: 501, max: 600 },
		  { min: 601, max: 700 },
		  { min: 701, max: 800 },
		  { min: 801, max: 900 },
		  { min: 901, max: Number.POSITIVE_INFINITY } // "above" range
		];
	
		// Calculate the number of items in each price range
		const priceRangeCounts = priceRanges.map(range => {
		  const count = filteredProducts.filter(product =>
			product.price >= range.min && product.price <= range.max
		  ).length;
		  return {
			range: `${range.min} - ${range.max === Number.POSITIVE_INFINITY ? 'above' : range.max}`,
			count,
		  };
		});
	
		res.status(200).json({
			message:"Data fetched successfully for bar chart",
			status:"success",
		  selectedMonth,
		  priceRangeCounts,
		});
	  } catch (error) {
		console.error(error);
		res.status(500).json({
		  message: "Error calculating bar chart data",
		  error: error.message,
		});
	  }
};
// Api for calculating data for pie chart
exports.pie_chart = async (req, res) => {
		try {
			const apiUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
			const selectedMonth = req.body.selectedMonth;
			const selectedMonthStart = moment(selectedMonth, 'YYYY-MM').startOf('month');
			const selectedMonthEnd = moment(selectedMonth, 'YYYY-MM').endOf('month');
			const response = await axios.get(apiUrl);
        	const data = response.data;
		
			// Filter products based on the selected month
			const filteredProducts = data.filter(product => {
			  const saleDate = moment(product.dateOfSale);
			  return saleDate.isBetween(selectedMonthStart, selectedMonthEnd, null, '[]');
			});
		
			// Calculate unique categories and the number of items from each category
			const categoryCounts = {};
			filteredProducts.forEach(product => {
			  const category = product.category;
			  categoryCounts[category] = (categoryCounts[category] || 0) + 1;
			});
		
			// Convert categoryCounts to the desired format for the API response
			const pieChartData = Object.keys(categoryCounts).map(category => ({
			  category,
			  itemCount: categoryCounts[category],
			}));
		
			res.status(200).json({
			  message:"Data for pie chart is fetched successfully",
			  status:"success",
			  selectedMonth,
			  pieChartData,
			});
		  } catch (error) {
			console.error(error);
			res.status(500).json({
			  message: "Error calculating pie chart data",
			  error: error.message,
			});
		  }
		
	
		
	
};
// Api for Getting all Static data in one api
exports.all_static_data = async (req, res) => {
	try{
		// Calculating static data
		const selectedMonth = req.body.selectedMonth;
		const selectedMonthStart = moment(selectedMonth, 'YYYY-MM').startOf('month');
		const selectedMonthEnd = moment(selectedMonth, 'YYYY-MM').endOf('month');
		const apiUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
		const response = await axios.get(apiUrl);
        const data = response.data;

		// Filter products based on the selected month
		const filteredProducts = data.filter(product => {
			const saleDate = moment(product.dateOfSale);
			return saleDate.isBetween(selectedMonthStart, selectedMonthEnd, null, '[]');
		  });
		  const totalSaleAmount = filteredProducts.reduce((total, product) => total + product.price, 0);
		  const totalSoldItems = filteredProducts.filter(product => product.sold).length;
		  const totalNotSoldItems = filteredProducts.filter(product => !product.sold).length;
		  const staticData = {
			totalSaleAmount,totalSoldItems,totalNotSoldItems,selectedMonth
		  }


		  //Calculating bar_chart api data
		  const filteredProductss = data.filter(product => {
			const saleDate = moment(product.dateOfSale);
			return saleDate.isBetween(selectedMonthStart, selectedMonthEnd, null, '[]');
		  });
		// Define price ranges
		const priceRanges = [
		  { min: 0, max: 100 },
		  { min: 101, max: 200 },
		  { min: 201, max: 300 },
		  { min: 301, max: 400 },
		  { min: 401, max: 500 },
		  { min: 501, max: 600 },
		  { min: 601, max: 700 },
		  { min: 701, max: 800 },
		  { min: 801, max: 900 },
		  { min: 901, max: Number.POSITIVE_INFINITY } // "above" range
		];
	
		// Calculate the number of items in each price range
		const priceRangeCounts = priceRanges.map(range => {
		  const count = filteredProductss.filter(product =>
			product.price >= range.min && product.price <= range.max
		  ).length;
		  return {
			range: `${range.min} - ${range.max === Number.POSITIVE_INFINITY ? 'above' : range.max}`,
			count,
		  };
		});
		const barChartApiData = {
			priceRangeCounts,selectedMonth
		}

		//Calculating pie data in single api
		const filteredProductsss = data.filter(product => {
			const saleDate = moment(product.dateOfSale);
			return saleDate.isBetween(selectedMonthStart, selectedMonthEnd, null, '[]');
		  });
	  
		  // Calculate unique categories and the number of items from each category
		  const categoryCounts = {};
		  filteredProductsss.forEach(product => {
			const category = product.category;
			categoryCounts[category] = (categoryCounts[category] || 0) + 1;
		  });
	  
		  // Convert categoryCounts to the desired format for the API response
		  const pieChartData = Object.keys(categoryCounts).map(category => ({
			category,
			itemCount: categoryCounts[category],
		  }));
		  const pieChartDataa = {
			pieChartData,selectedMonth
		  }
		  res.status(200).send({message:"Data fetched successfully",status:"success",
		data:{pieChartData,barChartApiData,staticData}})
	}catch(error){
		console.error(error);
		res.status(500).json({
		  message: "Error calculating All statistics data",
		  error: error.message,
		});
	}
};
