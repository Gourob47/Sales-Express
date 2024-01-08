const Sale = require("../models/Sale");


exports.getTotalRevenue = async (req,res) => {
  try {
    const result = await Sale.aggregate([
      {
        $group: {
          _id: null, // Grouping all documents
          totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } } // Calculating total revenue
        }
      }
    ]);
   // Assuming there is at least one sale transaction, the result will be an array with one object
    if (result.length > 0) {
      res.json(result);
    } else {
      res.json("NO data"); // If there are no sales, return 0
    }
  } catch (error) {
    console.error('Error getting total revenue:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getQuantitySoldByProduct = async (req,res) => {
  try {
    const result = await Sale.aggregate([
      {
        $group: {
          _id: '$product', // Grouping documents by product
          totalQuantity: { $sum: '$quantity' } // Summing the quantity for each group (each product)
        }
      },
      {
        $project: { // Optional: reformat the output
          _id: 0,
          product: '$_id',
          totalQuantity: 1
        }
      },
      { $sort: { product: 1 } } // Optional: sort by product name
    ]);

    res.json(result); // Returns an array of objects with product and totalQuantity
  } catch (error) {
    console.error('Error getting total quantity per product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTopProductsByRevenue = async (req,res) => {
  try {
    const result = await Sale.aggregate([
      {
        $group: {
          _id: '$product', // Group by product
          totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } } // Calculate total revenue per product
        }
      },
      { $sort: { totalRevenue: -1 } }, // Sort by totalRevenue in descending order
      { $limit: 5 }, // Limit to top 5
      {
        $project: { // Optional: reformat the output
          _id: 0,
          product: '$_id',
          totalRevenue: 1
        }
      }
    ]);

    res.json(result);
  } catch (error) {
    console.error('Error getting top selling products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getAveragePrice = async (req,res) => {
  try {
    const result = await Sale.aggregate([
      {
        $group: {
          _id: null, // The _id set to null will group all records together
          averagePrice: { $avg: '$price' } // Calculate the average price across all sales
        }
      },
      {
        $project: {
          _id: 0,
          averagePrice: 1
        }
      }
    ]);

    res.json(result);

    
  } catch (error) {
    console.error('Error getting average price of products sold:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getRevenueByMonth = async (req, res) => {
  try {
    const revenueByMonth = await Sale.aggregate([
      {
        $project: { // Changed from $addFields to $project
          date: {
            $cond: {
              if: { $eq: [{ $type: "$date" }, "string"] },
              then: { $toDate: "$date" },
              else: "$date"
            }
          },
          quantity: 1, // Preserve the original quantity field
          price: 1 // Preserve the original price field
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } }
        }
      },
      {
        $sort: { // Adding a sort stage to order the results chronologically
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);
    
    res.json(revenueByMonth);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getHighestQuantitySold = async (req, res) => {
  try {
    const topProduct = await Sale.aggregate([
      {
        $addFields: {
          convertedDate: {
            $cond: {
              if: { $eq: [{ $type: "$date" }, "string"] },
              then: { $toDate: "$date" },
              else: "$date"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$convertedDate" } }, // Group by date using the convertedDate
            product: "$product" // Group by product
          },
          totalSold: { $sum: "$quantity" } // Calculate total quantity sold per product per day
        }
      },
      { $sort: { totalSold: -1 } }, // Sort by total sold in descending order
      { $limit: 1 }, // Take the top record
      {
        $project: {
          _id: 0, // Exclude _id from results
          date: "$_id.date",
          product: "$_id.product",
          totalSold: 1
        }
      }
    ]);

    // Check if the result array is not empty, meaning a top product was found
    if (topProduct.length > 0) {
      res.json(topProduct[0]); // Return the product with the highest quantity sold on a single day
    } else {
      res.json({ message: "No sales data found" });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getDepartmentSalaryExpense = async (req, res) => {
  try {
    const totalSalaryByDepartment = await Sale.aggregate([
      {
        $group: {
          _id: "$department", // Group by department
          totalSalary: { $sum: "$salary" } // Sum the salaries for each department
        }
      },
      {
        $project: {
          department: "$_id",
          totalSalary: 1,
          _id: 0
        }
      }
    ]);

    // Send the result back as a JSON response
    res.json(totalSalaryByDepartment);
  } catch (error) {
    console.error('Error getting total salary by department:', error);
    res.status(500).send('Internal Server Error');
  }
  };


