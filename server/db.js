'use-strict';

// 如何定义model 数据库逻辑
const mysql2 = require('mysql2');
const Sequelize = require('sequelize');
const config = require('./config');
const uuid = require('node-uuid');

// console.log('init sequelize...')

function generateId() {
    return uuid.v4();
}

// console.log(`this database is: ${config.database}`)

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: 'localhost',
    dialect: 'mysql',
    dialectModule: mysql2,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

const ID_TYPE = Sequelize.STRING(50);

function defineModel(name, attributes) {
    // console.log(`this attributes: ${attributes}`) // object
    let attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        // console.log(`this value is: ${value}`)
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            }
        }
    };
    attrs.id = {
        type: ID_TYPE,
        primaryKey: true
    };
    attrs.createAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.updateAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    // console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function (k, v) {
    //     if (k === 'type') {
    //         for (let key in Sequelize) {
    //             if (key === 'ABSTRACT' || key === 'NUMBER') {
    //                 continue;
    //             }
    //             let dbType = Sequelize[key];
    //             if (typeof dbType === 'function') {
    //                 if (v instanceof dbType) {
    //                     if (v._length) {
    //                         return `${dbType.key}(${v._length})`;
    //                     }
    //                     return dbType.key;
    //                 }
    //                 if (v === dbType) {
    //                     return dbType.key;
    //                 }
    //             }
    //         }
    //     }
    //     return v;
    // }, '  '));
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                if (obj.isNewRecord) {
                    if (!obj.id) {
                        obj.id = generateId();
                    }
                    obj.createAt = now;
                    obj.updateAt = now;
                    obj.version = 0;
                } else {
                    obj.updateAt = Date.now();
                    obj.version++;
                }
            }
        }
    })
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

var exp = {
    defineModel: defineModel,
    sync: () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            sequelize.sync({ force: true });
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
};

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}

exp.ID = ID_TYPE;
exp.generateId = generateId;

module.exports = exp;