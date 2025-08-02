const Property = require("../models/Property");

function listenToPropertyChanges() {
  const pipeline = [
    {
      $match: {
        operationType: { $in: ["insert", "update"] },
        "fullDocument.status": { $ne: "sold" },
      },
    },
    {
      $project: {
        operationType: 1,
        fullDocument: {
          title: 1,
          price: 1,
          location: 1,
          status: 1,
        },
        documentKey: 1,
        updateDescription: 1,
      },
    },
  ];

  const changeStream = Property.watch(pipeline);

  changeStream.on("change", (change) => {
    console.log("Filtered property change:");
    console.log(JSON.stringify(change, null, 2));
  });

  changeStream.on("error", (err) => {
    console.error("Change Stream error:", err);
  });
}

module.exports = { listenToPropertyChanges };
