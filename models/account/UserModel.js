const mongoose = require('mongoose');
const mongooseApiQuery = require('mongoose-api-query');
const bcrypt = require('bcrypt-nodejs');
const config = require('../../config/main');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        userID: {           // 사용자아이디
            type: String,
            unique: true,
            required: true
        },
        password: {         // 비밀번호
            type: String,
            required: true
        },
        email:{             // 이메일
            type: String 
        },
        realName: {         // 이름
            type: String 
        },
        phoneNumber: {      // 전화번호
            type: String 
        },
        height: {           // 키
            type: Number 
        },
        weight: {           // 몸무게
            type: Number 
        },
        region: [{          // 선호지역(활동지역)
            type: String 
        }],
        level: {            // 레벨
            type: String 
        },
        position: [{        // 포지션
            type: String 
        }],
        content: {          // 나의 한마디
            type: String
        },
        recommended: {      // 추천선수노출
            type: Boolean,
            default: true
        },
        invited: {          // 초대허용
            type: Boolean,
            default: true
        },
        image: {            // 프로필사진
            type: String  
        },
        enabled: {          // 사용가능 ( 'APPROVAL', 'WAIT', 'CANCEL' )
            type: String 
        },
        intercepted: {      // 차단 ( 채팅 또는 영입하기에서 이용 )
            type: Boolean,
            default: false
        },
        blockList: [{       // 메세지 차단리스트
            type: Schema.Types.ObjectId,
            ref: config.db_collection_prefix + 'users'
        }],
        mainTeam: {         // 대표팀
            type: Schema.Types.ObjectId,
            ref: config.db_collection_prefix + 'teams'
        },
        belongs: [{         // 소속된 팀들
            type: Schema.Types.ObjectId,
            ref: config.db_collection_prefix + 'teams'
        }],
        owns: [{            // 관리하는 팀들
            type: Schema.Types.ObjectId,
            ref: config.db_collection_prefix + 'teams'
        }],
        ranking: {          // 랭킹
            type: Number
        },
        star: {             // 스타플레이어 ( 스타 / 올스타 / 슈퍼스타 )
            type: String
        },
        marks: {            // 점수
            main: { type: Number },     // 기본기
            attack: { type: Number },   // 공격력
            defense: { type: Number },  // 수비력
            leading: { type: Number },  // 리딩력
            manner: { type: Number },   // 매너
            wins: { type: Number },     // 승
            defeats: { type: Number },  // 패,
            mvp: { type: Number }       // MVP 선정횟수
        },
        reviews: [{         // 리뷰
            type: String
        }],
        activatedItems: [{  // 활동종목
            type: String
        }],
    },
    {
        timestamps: true
    }
);

//= ===============================
// User ORM Methods
//= ===============================

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
  const user = this,
    SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
};


UserSchema.plugin(mongooseApiQuery);
// UserSchema.plugin(createdModified, {index: true});

module.exports = mongoose.model(config.db_collection_prefix + 'users', UserSchema);
