import { createSlice } from "@reduxjs/toolkit";
import { z } from "zod";

const MonitorSchema = z.object({
  id: z.string(),
  url: z.string(),
  

})

const monitorSlice = createSlice({
  name: 'monitors'
})