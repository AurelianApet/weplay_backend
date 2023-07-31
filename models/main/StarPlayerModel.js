const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseApiQuery = require('mongoose-api-query');
const config = require('../../config/main');

const StarPlayerSchema = new Schema(
    {
        uid: {              // 스타플레이어 신청자
            type: String
        },
        career: {           // 경력
            type: String    
        },
        hopeItems: {        // 레벨업 후 희망사항
            type: String    
        },
        otherRequests: {    // 기타 요청사항
            type: String    
        },
        schedule: [{        // 게임가능일정
            day: { type: Number },          // 요일
            startTime: { type: String },    // 시작시간
            endTime: { type: String }       // 마감시간
        }]
    },
    {
        timestamps: true
    }
);
StarPlayerSchema.plugin(mongooseApiQuery);
module.exports = mongoose.model(config.db_collection_prefix + 'starplayers', StarPlayerSchema);