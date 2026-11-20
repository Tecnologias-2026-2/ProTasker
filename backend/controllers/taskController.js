import * as taskModel from "../models/taskModel.js";
import { isValidTaskId, normalizeTask } from "../utils/validation.js";

export async function getTasks(request, response, next) {
  try {
    response.json(await taskModel.listTasks(request.user.uid));
  } catch (error) {
    next(error);
  }
}

export async function putTask(request, response, next) {
  const task = normalizeTask(request.params.taskId, request.body);
  if (!task) {
    response.status(400).json({
      error: { code: "task/invalid-data", message: "Los datos de la tarea no son válidos." }
    });
    return;
  }

  try {
    response.json(await taskModel.saveTask(request.user.uid, task));
  } catch (error) {
    next(error);
  }
}

export async function removeTask(request, response, next) {
  if (!isValidTaskId(request.params.taskId)) {
    response.status(400).json({
      error: { code: "task/invalid-id", message: "El identificador de la tarea no es válido." }
    });
    return;
  }

  try {
    await taskModel.deleteTask(request.user.uid, request.params.taskId);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
}
