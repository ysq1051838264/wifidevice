/**
 * Created by hdr on 2017/2/23.
 */
import Api from './api';
import {
    NativeModules,
}from 'react-native';

export default class MeasureActions {

    static fetchLastMeasurement(user_id) {
        return Api.doGet(path_fetch_last_data, {user_id, last: 1});
    }

    static fetchScaleNameAndInternalModel(device) {
        const mac = device["mac"];
        console.log("打印mac地址：", mac);
        return Api.doPost(path_get_device_model, {mac: mac})
            .then((device1) => {
                device1["mac"] = mac;
                return device1;
            });
    }

    static occupyMeasure(time, user_id, mac) {
        return Api.doPost(path_occupy_measure, {
            start_time: time,
            m_user_id: user_id,
            mac: mac,
        })
    }

    static fetchModel(device) {
        const {scale_name, internal_model, mac} = device;
        return NativeModules.QNDeviceInfo.fetchDeviceInfo(scale_name, internal_model, mac)
    }

    static bindDevice(scale_name, internalModel, mac, scale_type, device_type) {
        return Promise.race([Api.doPost(path_bind_device, {
            scale_name: scale_name,
            internal_model: internalModel,
            mac: mac,
            bind_link:1,
            scale_type: scale_type,
            device_type: device_type,
        }), Api.timeout()]);
    }

    static fetchUnknownMeasure(userid, lastSynTime, previousDataTime) {
        return Api.doGet(path_unknown_measurements, {
            user_id: userid,
            previous_created_at: previousDataTime,
            last_at: lastSynTime
        }).then(data => {
            var invalidData = data.invalid_data
            return new Promise.resolve(invalidData)
        });
    }

    static deleteInvalidData(dataIds) {
        return Api.doPost(path_delete_invalid_data, {
            ids: dataIds,
        })
    }

    static assignInvalidData(userId, dataIds) {
        return Api.doPost(path_assign_invalid_data, {
            assign_user_id: userId,
            ids: dataIds,
        })
    }

}

const path_get_device_model = "/api/v5/devices/get_model.json";
const path_bind_device = "/api/v5/commons/q_niu_save_device.json";
const path_unknown_measurements = "/api/v5/measurements/get_histories.json";
const path_fetch_last_data = "/api/v5/measurements.json";
//删除未知数据接口
const path_delete_invalid_data = "/api/v5/measurements/delete_invalid_data.json";
//分配未知数据接口
const path_assign_invalid_data = "/api/v5/measurements/assign_invalid_data.json";
const path_occupy_measure = "/api/v5/devices/link.json";

