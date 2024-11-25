import { deleteAsync } from "del";

export const reset = async (cb) => {
	await deleteAsync(app.path.clean);
	cb();
}