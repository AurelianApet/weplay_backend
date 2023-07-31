const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseApiQuery = require('mongoose-api-query');
const config = require('../../config/main');

const TeamSchema = new Schema(
    {
        name: {                 // 팀명
            type: String
        },
        captain: {              // 주장
            type: Schema.Types.ObjectId,
            ref: config.db_collection_prefix + 'users'
        },
        viceCaptain: {          // 부주장
            type: Schema.Types.ObjectId,
            ref: config.db_collection_prefix + 'users'
        },
        subName: {
            type: String        // 팀 부제
        },
        schedule: [{            // 정규게임일정
            day: { type: Number },          
            startTime: { type: String },    
            endTime: { type: String }       
        }],
        requestItems: {         // 매칭요청사항
            type: String
        },
        uniformColor: {         // 유니폼 색상
            type: String    
        },
        content: {              // 간략한 소개
            type: String
        },
        courtName: {            // 경기장명
            type: String
        },
        courtAddress: {         // 경기장주소
            type: String
        },
        courtAddressDetail: {   // 경기장 상세주소
            type: String
        },
        logo: {                 // 로고 사진
            type: String
        },
        image: {                // 팀 프로필 사진
            type: String
        },
        recommended: {          // 추천팀노출 허용
            type: Boolean
        },
        challenged: {           // 도전허용
            type: Boolean
        },
        members: [{             // 팀원들
            uid: {              // 팀원 id 
                type: Schema.Types.ObjectId,
                ref: config.db_collection_prefix + 'users'
            },          
            backNumber: { type: Number }    //  등번호
        }],
        level: {                // 팀 레벨
            type: String 
        },
        ranking: {              // 랭킹
            type: Number 
        },
        wins: {                 // 승
            type: String 
        },
        defeats: {              // 패
            type: String 
        },
    },
    {
        timestamps: true
    }
);
TeamSchema.plugin(mongooseApiQuery);
module.exports = mongoose.model(config.db_collection_prefix + 'teams', TeamSchema);