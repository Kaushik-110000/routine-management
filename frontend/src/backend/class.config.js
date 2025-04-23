import server from "../conf/conf.js";
import axios from "axios";

axios.defaults.withCredentials = true;

export class Classservice {
  async getAllClasses() {
    try {
      const response = await axios.get(`${server.serverUrl}/classes`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async addClass(data) {
    try {
      const response = await axios.post(`${server.serverUrl}/classes`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteClass(classID) {
    try {
      const response = await axios.delete(
        `${server.serverUrl}/classes/${classID}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getSchedule(classID, day) {
    try {
      const response = await axios.get(
        `${server.serverUrl}/classes/${classID}/schedule`,
        { params: { day } }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async addSchedule(classID, slot) {
    try {
      const response = await axios.post(
        `${server.serverUrl}/classes/${classID}/schedule`,
        slot
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteSchedule(classID, day, slotIndex) {
    try {
      const response = await axios.delete(
        `${server.serverUrl}/classes/${classID}/schedule`,
        { params: { day, slotIndex } }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const classservice = new Classservice();
export default classservice;
