exports.update_response = (res, doc) => {
    if (doc) {
        if (doc && doc.n >= 1) {
            return res.status(200).send({
                success: true,
                res: doc
            });
        } else {
            return res.status(400).send({
                error: '해당 데이터가 없습니다.'
            });
        }
    } else {
        return res.status(400).send({
            error: '해당 데이터가 없습니다.'
        });
    }
}

exports.delete_response = (res, doc) => {
    if (doc) {
        if (doc.result && doc.result.n > 0) {
            return res.status(200).send({
                success: true,
                affected: doc.result.n
            });
        } else {
            return res.status(400).send({
                error: '해당 데이터가 없습니다.'
            });
        }
    } else {
        return res.status(400).send({
            error: '해당 데이터가 없습니다.'
        });
    }
}

exports.receive_response = (res, doc, receivedAt) => {
    if (doc) {
        if (doc && doc.n === 1) {
            return res.status(200).send({
                receivedAt: receivedAt,
            });
        } else {
            return res.status(400).send({
                error: '해당 데이터가 없습니다.'
            });
        }
    } else {
        return res.status(400).send({
            error: '해당 데이터가 없습니다.'
        });
    }
}