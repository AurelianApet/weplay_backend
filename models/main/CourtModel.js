const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseApiQuery = require('mongoose-api-query');
const config = require('../../config/main');

const CourtSchema = new Schema(
    {
        uid: {                  // 경기장 소유자 ( 호스트 )
            type: Schema.Types.ObjectId,
            ref: config.db_collection_prefix + 'users'
        },
        businessNumber: {       // 사업자번호
            type: String
        },
        callNumber: {           // 연락처
            type: String
        },
        address: {              // 주소
            type: String
        },
        square: {               // 면적
            type: Number
        },
        accommodation: {        // 수용인원
            type: Number
        },
        businessTime: [{        // 운영시간
            day: { type: Number },
            startTime: { type: String },
            endTime: { type: String }
        }],
        info: {                 // 체육관 정보
            type: String
        },
        price: {                // 대여단가
            weekday: { type: Number },          // 평일 1시간당 단가
            weekend: { type: Number }           // 주말 1시간당 단가
        },
        equipments: {           // 편의시설
            mike: { type: Boolean },            // 음향/마이크
            shower: { type: Boolean },          // 샤워시설
            insideToilet: { type: Boolean },    // 내부화장실
            aircon: { type: Boolean },          // 에어컨
            waterPurifier: { type: Boolean },   // 정수기
            outlet: { type: Boolean },          // 콘센트
            noSmoking: { type: Boolean },       // 금연
            parking: { type: Boolean },         // 주차
            lockerRoom: { type: Boolean }       // 탈의실
        },
        image: {                // 대표자 사진
            type: String
        },
        courtImage: {           // 코트 사진
            main: { type: String },             // 경기장 사진
            others: [{                          // 기타 사진
                type: String 
            }]            
        },
        lightImage: {           // 조명 사진
            type: String
        },
        showerImage: {          // 샤워장 사진
            type: String
        },
        enabled: {              // 사용가능 ( 'APPROVAL', 'WAIT', 'CANCEL' )
            type: String
        }
    },
    {
        timestamps: true
    }
);
CourtSchema.plugin(mongooseApiQuery);
module.exports = mongoose.model(config.db_collection_prefix + 'courts', CourtSchema);