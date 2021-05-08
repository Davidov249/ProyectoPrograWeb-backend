let chai = require("chai");
let chaiHttp = require("chai-http");
const { response } = require("../app");
let server = require("../app");

//Assertion Style
chai.should();

chai.use(chaiHttp)

describe('Rutas Musica', () => {
    /**
     * Test de ruta GET
     */

    describe("GET /api/v1/music", () => {
        it("It should GET all the songs", (done) => {
            chai.request(server)
                .get("/api/v1/music")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                done();
                })
        })
    })

    /**
     * Test de ruta GET (por id)
     */

     describe("GET /api/v1/music/:param", () => {
        it("It should GET a song by id", (done) => {
            chai.request(server)
                .get("/api/v1/music/60711170b7408b580ca4566c")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.result[0].name.should.equal("Hand Granades")
                done();
                })
        })
    })

    /**
     * Test de ruta POST
     */

     describe("POST /api/v1/music/", () => {
        it("It should POST a new song", (done) => {
            const song = {
                name: "Prueba",
                author: "ChaiTest",
                genre: "Testing",
                length: "1:23"
            }
            chai.request(server)
                .post("/api/v1/music/")
                .send(song)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                done();
                })
        })
    })

    /**
     * Test de ruta PUT
     */

     describe("PUT /api/v1/music/:id", () => {
        it("It should PUT an update on a song", (done) => {
            const song = {
                name: "Hand Granades",
                author: "The Offspring",
                genre: "Punk Rock",
                length: "1:06"
            }
            chai.request(server)
                .put("/api/v1/music/60711170b7408b580ca4566c")
                .send(song)
                .end((err, response) => {
                    response.should.have.status(202);
                    response.body.should.be.a('object');
                done();
                })
        })
    })

    /**
     * Test de ruta DELETE
     */
})