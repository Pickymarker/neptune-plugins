// @ts-expect-error Types arent defined for @plugin
import { storage } from "@plugin";

type Storage = Record<any, any> & { settings?: never };
type StorageSettings = Record<any, any>;
export const getStorage = <T extends Storage>(defaultValue: T): T => {
	Object.keys(defaultValue).forEach((key) => (storage[key] ??= defaultValue[key]));
	return storage;
};
export const getSettings = <T extends StorageSettings>(defaultValue: T): T => storage.settings ?? (storage.settings = defaultValue);
