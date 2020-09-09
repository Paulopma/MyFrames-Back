import express from "express"
import {userRouter} from "./routes/UserRouter"
import {AddressInfo} from "net";

const app = express()

const server = app.listen(3003, () => {
  if(server) {
    const address = server.address() as AddressInfo
    console.log(`Server running in http://localhost:${address.port}`)
  } else {
    console.error(`Couldn't initialize server.`)
  }
})

app.use("/users/", userRouter)
