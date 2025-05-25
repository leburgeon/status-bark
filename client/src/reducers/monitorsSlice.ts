import { createSlice } from "@reduxjs/toolkit";
import { z } from "zod";

const MonitorSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  url: z.string(),
  status: z.string()
  
})

const monitorSlice = createSlice({
  name: 'monitors'
})