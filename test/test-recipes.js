const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Recipes", function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

 // GET CURRENT LIST OF RECIPES
  it("should list recipes on GET", function() {
  
    return chai
      .request(app)
      .get("/recipes")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");
        expect(res.body.length).to.be.at.least(1);

        const expectedKeys = ["id", "name", "ingredients"];
        res.body.forEach(function(item) {
          expect(item).to.be.a("object");
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

// ADD A NEW RECIPE
  it("should add a recipe on POST", function() {
    const newRecipe = { name: "grits", ingredients:["corn", "cream", "salt", "pepper"] };
    return chai
      .request(app)
      .post("/recipes")
      .send(newRecipe)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.include.keys("id", "name", "ingredients");
        expect(res.body.id).to.not.equal(null);
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id`
        expect(res.body).to.deep.equal(
          Object.assign(newRecipe, { id: res.body.id })
        );
      });
  });

  // UPDATE A RECIPE
  it("should update a recipe on PUT", function() {

    const updateData = {
      name: "ham sandwich",
      ingredients: ["bread","ham","mayo"]
    };

    return chai
        .request(app)
        .get("/recipes")
        .then(function(res) {
          updateData.id = res.body[0].id;

          return chai
            .request(app)
            .put(`/recipes/${updateData.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        });
  });

 // DELETE A RECIPE
  it("should delete a recipe on DELETE", function() {
    return chai
        .request(app)
        .get("/recipes")
        .then(function(res) {
          return chai
          .request(app)
          .delete(`/recipes/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        });
  });
});
