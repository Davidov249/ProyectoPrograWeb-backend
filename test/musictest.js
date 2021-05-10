let chai = require("chai");
let chaiHttp = require("chai-http");
const sinon = require("sinon");
const auth = require("../routes/auth")

//Assertion Style
chai.should();

chai.use(chaiHttp)

describe('Rutas Musica', () => {
    /**
     * Test de ruta GET
     */
    sinon.stub(auth, "verifyJwt").callsFake(async (req, res, next) => next());
    let server = require("../app");
    describe("GET /api/v1/music/:id", () => {
        it("It should GET user playlist", () => {
            chai.request(server)
                .get("/api/v1/music/UsuarioPrueba")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                })
        })
    })

    /**
     * Test de ruta GET (por id)
     */

    describe("GET /api/v1/music/one/:id", () => {
        it("It should GET a song by id", () => {
            chai.request(server)
                .get("/api/v1/music/one/60984206893f5b08900a0885")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.result[0].name.should.equal("Hazy Skyscraper")
                })
        })
    })

    /**
     * Test de ruta POST
     */

     describe("POST /api/v1/music/", () => {
        it("It should POST a new song", () => {
            const song = {
                userid: "UsuarioPrueba",
                name: "Pruebax",
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
                })
        })
    })

    /**
     * Test de ruta PUT
     */

     describe("PUT /api/v1/music/:id", () => {
        it("It should PUT an update on a song", () => {
            const song = {
                userid: "UsuarioPrueba",
                name: "Prueba",
                author: "ChaiTest",
                genre: "Testing",
                length: "3:21"
            }
            chai.request(server)
                .put("/api/v1/music/60985abae9c04209ce3ddd56")
                .send(song)
                .end((err, response) => {
                    response.should.have.status(202);
                    response.body.should.be.a('object');
                })
        })
    })
    auth.verifyJwt.restore();
});