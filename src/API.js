import { handleErrors } from "./utils";
import * as uuid from "uuid/v4";

export const getUserByUserName = (props, userName) => {
    return fetch(`/users/${userName}`, {
        method: "GET",
        headers: new Headers({
            Authorization: "Bearer " + props.token,
            "Content-Type": "application/json"
        })
    })
    .then(res => res.json())
    /*    .then(res =>
            ({
                "username": "andy",
                "previousPassword": "",
                "password": "",
                "cognitoId": "5527a453-924f-44b2-bf06-47dae80e0519",
                "picture": "",
                "businesses": [
                    {"name": "NatureFinest", "description": "Description of the business 1"},
                    {"name": "The Wave", "description": "Description of the business 2"}],
                "roles": [{"walletId": "naturesFinest", "role": "businessOwner"}],
                "globalRoles": [],
                "email": "andy@naturesfinest.com",
                "phoneNumber": "+1123456789",
                "firstName": "BusinessOwnerAndy",
                "lastName": "Andy",
                "address": "",
                "zipCode": "",
                "city": "",
                "position": "",
                "enabled": false
            })
        )*/
        .then(handleErrors);
};

export const getBusinessById = (props, businessId) => {
    return fetch(`/businesses/${businessId}`, {
        method: "GET",
        headers: new Headers({
            Authorization: "Bearer " + props.token,
            "Content-Type": "application/json"
        })
    })
    .then(res => res.json())
    /*    .then(res =>
            ({
                name: "naturefinest",
                description: "a business description",
            })
        )*/
        .then(handleErrors);
};

export const getUserById = (props, userId) => {
    return fetch(`/users/${userId}`, {
        method: "GET",
        headers: new Headers({
            Authorization: "Bearer " + props.token,
            "Content-Type": "application/json"
        })
    })
        .then(res => res.json())
        /*    .then(res =>
            {
                "username": "andy",
                "previousPassword": "",
                "password": "",
                "cognitoId": "5527a453-924f-44b2-bf06-47dae80e0519",
                "picture": "",
                "businesses": [{"name": "NatureFinest", "description": "Description of the business 1"}],
                "roles": [{"walletId": "naturesFinest", "role": "businessOwner"}],
                "globalRoles": [],
                "email": "andy@naturesfinest.com",
                "phoneNumber": "+1123456789",
                "firstName": "BusinessOwnerAndy",
                "lastName": "Andy",
                "address": "",
                "zipCode": "",
                "city": "",
                "position": "",
                "enabled": true
            }
        )*/
        .then(handleErrors);
};

export const getProofOfReserve = (props) => {
    return fetch(`/token/proof-of-reserve`, {
        method: "GET",
        headers: new Headers({
            Authorization: "Bearer " + props.token,
            "Content-Type": "application/json",
            "x-correlation-id": uuid(),
        })
    })
        .then(res => res.json())
        /*    .then(res =>
                ({
                 "amount": 10199
                })
            )*/
        .then(handleErrors);
};

// TODO: add time range in the query and filters
export const getTransactions = (props) => {
    return fetch(`/token/transactions`, {
        method: "GET",
        headers: new Headers({
            Authorization: "Bearer " + props.token,
            "Content-Type": "application/json",
            "x-correlation-id": uuid(),
        })
    })
        .then(res => res.json())
        /*    .then(res =>
                ([{
                    "data": {
                        "data": [
                            {
                                "payload": {
                                    "data": {
                                        "config": {
                                            "channel_group": {
                                                "groups": {
                                                    "Application": {
                                                        "groups": {
                                                            "PeerOrg": {
                                                                "groups": {},
                                                                "mod_policy": "Admins",
                                                                "policies": {
                                                                    "Admins": {
                                                                        "mod_policy": "Admins",
                                                                        "policy": {
                                                                            "type": 1,
                                                                            "value": {
                                                                                "identities": [
                                                                                    {
                                                                                        "principal": {
                                                                                            "msp_identifier": "PeerOrg",
                                                                                            "role": "ADMIN"
                                                                                        },
                                                                                        "principal_classification": "ROLE"
                                                                                    }
                                                                                ],
                                                                                "rule": {
                                                                                    "n_out_of": {
                                                                                        "n": 1,
                                                                                        "rules": [
                                                                                            {
                                                                                                "signed_by": 0
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                },
                                                                                "version": 0
                                                                            }
                                                                        },
                                                                        "version": "0"
                                                                    },
                                                                    "Readers": {
                                                                        "mod_policy": "Admins",
                                                                        "policy": {
                                                                            "type": 1,
                                                                            "value": {
                                                                                "identities": [
                                                                                    {
                                                                                        "principal": {
                                                                                            "msp_identifier": "PeerOrg",
                                                                                            "role": "MEMBER"
                                                                                        },
                                                                                        "principal_classification": "ROLE"
                                                                                    }
                                                                                ],
                                                                                "rule": {
                                                                                    "n_out_of": {
                                                                                        "n": 1,
                                                                                        "rules": [
                                                                                            {
                                                                                                "signed_by": 0
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                },
                                                                                "version": 0
                                                                            }
                                                                        },
                                                                        "version": "0"
                                                                    },
                                                                    "Writers": {
                                                                        "mod_policy": "Admins",
                                                                        "policy": {
                                                                            "type": 1,
                                                                            "value": {
                                                                                "identities": [
                                                                                    {
                                                                                        "principal": {
                                                                                            "msp_identifier": "PeerOrg",
                                                                                            "role": "MEMBER"
                                                                                        },
                                                                                        "principal_classification": "ROLE"
                                                                                    }
                                                                                ],
                                                                                "rule": {
                                                                                    "n_out_of": {
                                                                                        "n": 1,
                                                                                        "rules": [
                                                                                            {
                                                                                                "signed_by": 0
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                },
                                                                                "version": 0
                                                                            }
                                                                        },
                                                                        "version": "0"
                                                                    }
                                                                },
                                                                "values": {
                                                                    "MSP": {
                                                                        "mod_policy": "Admins",
                                                                        "value": {
                                                                            "config": {
                                                                                "admins": [
                                                                                    "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM1VENDQW91Z0F3SUJBZ0lVZGJiNGRIRmRHbzJsampNYkxBNnNmNnJTaEtvd0NnWUlLb1pJemowRUF3SXcKUVRFUk1BOEdBMVVFQ2hNSVIzSmxlU0JKYm1NeEZUQVRCZ05WQkFzVERFZHlaWGtnVW05dmRDQkRRVEVWTUJNRwpBMVVFQXhNTVIzSmxlU0JTYjI5MElFTkJNQjRYRFRFNE1USXdOVEF4TXpBd01Gb1hEVEk0TVRJd01qQXhNelV3Ck1Gb3dnWUl4Q3pBSkJnTlZCQVlUQWxWVE1SY3dGUVlEVlFRSUV3NU9iM0owYUNCRFlYSnZiR2x1WVRFVU1CSUcKQTFVRUNoTUxTSGx3WlhKc1pXUm5aWEl4TERBTkJnTlZCQXNUQm1Oc2FXVnVkREFMQmdOVkJBc1RCR2R5WlhrdwpEZ1lEVlFRTEV3ZFFaV1Z5VDNKbk1SWXdGQVlEVlFRREV3MVFaV1Z5VDNKbkxXRmtiV2x1TUZrd0V3WUhLb1pJCnpqMENBUVlJS29aSXpqMERBUWNEUWdBRUQrRCtoVTZuT001SW9MUHV6KzgzUGl4a3hPWldzbS8xRjVubDNOVDQKaDJTbWNJQ0dHTzc0ZSt6TDBrYkJpcjNuejdoc0dOWnNKSTFLVWd3cDkyWk54Nk9DQVIwd2dnRVpNQTRHQTFVZApEd0VCL3dRRUF3SUhnREFNQmdOVkhSTUJBZjhFQWpBQU1CMEdBMVVkRGdRV0JCVHNnYzFzRXNBcHFlSm9EQ2UvCjh4RHJnREcwcURBZkJnTlZIU01FR0RBV2dCUzIxY2paOVhHaFZYR3Vwd29BNUcrekplT1hvREE4QmdOVkhSRUUKTlRBemdqRnlkVzV1WlhJdE5UWmlaV1JsWmprdGNISnZhbVZqZEMwNE1qRTVOek0xTFdOdmJtTjFjbkpsYm5RdApNRGRzYkdoM01Ic0dDQ29EQkFVR0J3Z0JCRzk3SW1GMGRISnpJanA3SW1Ga2JXbHVJam9pZEhKMVpTSXNJbWhtCkxrRm1abWxzYVdGMGFXOXVJam9pWjNKbGVTNVFaV1Z5VDNKbklpd2lhR1l1Ulc1eWIyeHNiV1Z1ZEVsRUlqb2kKVUdWbGNrOXlaeTFoWkcxcGJpSXNJbWhtTGxSNWNHVWlPaUpqYkdsbGJuUWlmWDB3Q2dZSUtvWkl6ajBFQXdJRApTQUF3UlFJaEFLRmFFdnV2T1ZyZjBVSFh2MFRCdnFPZER3MVhBYXdVd0hpZDJJUXA4SmJSQWlBeFBOaWFVOXMrCmx5N1VGOGRjbUY2Qm5NWU1UTTM0aitDZ1RPeEcrNE1qSFE9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg=="
                                                                                ],
                                                                                "crypto_config": {
                                                                                    "identity_identifier_hash_function": "SHA256",
                                                                                    "signature_hash_family": "SHA2"
                                                                                },
                                                                                "fabric_node_ous": null,
                                                                                "intermediate_certs": [],
                                                                                "name": "PeerOrg",
                                                                                "organizational_unit_identifiers": [],
                                                                                "revocation_list": [],
                                                                                "root_certs": [
                                                                                    "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJ5RENDQVcrZ0F3SUJBZ0lVYWNleU94Y1VBZ0cxUkdIdTZIb1QyYy9SZWNvd0NnWUlLb1pJemowRUF3SXcKUVRFUk1BOEdBMVVFQ2hNSVIzSmxlU0JKYm1NeEZUQVRCZ05WQkFzVERFZHlaWGtnVW05dmRDQkRRVEVWTUJNRwpBMVVFQXhNTVIzSmxlU0JTYjI5MElFTkJNQjRYRFRFNE1USXdOVEF4TWprd01Gb1hEVE16TVRJd01UQXhNamt3Ck1Gb3dRVEVSTUE4R0ExVUVDaE1JUjNKbGVTQkpibU14RlRBVEJnTlZCQXNUREVkeVpYa2dVbTl2ZENCRFFURVYKTUJNR0ExVUVBeE1NUjNKbGVTQlNiMjkwSUVOQk1Ga3dFd1lIS29aSXpqMENBUVlJS29aSXpqMERBUWNEUWdBRQpxZ0tqMlFLbFIxaWFGWWduU1VjR2NKWnJMZXRva1E2clVaWFZqU1hIME9vcitFRWRsdHJIZ1dyYWJqZ2VMK2lpClFVcEpRYzdlNzllUHNCYUdCYXg0bTZORk1FTXdEZ1lEVlIwUEFRSC9CQVFEQWdFR01CSUdBMVVkRXdFQi93UUkKTUFZQkFmOENBUUV3SFFZRFZSME9CQllFRkxiVnlObjFjYUZWY2E2bkNnRGtiN01sNDVlZ01Bb0dDQ3FHU000OQpCQU1DQTBjQU1FUUNJRC9kdFRWTmw0TjZjd3VJdzlQTm1jV002dkJkUnN2L2ZxMGJ2eHBLZ1lNV0FpQStsdFNECkYxY3A3VndLRTYzM2J1TUd4d2lvZUM1ckRXUFdIOUQ5WmNhNVVBPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo="
                                                                                ],
                                                                                "signing_identity": null,
                                                                                "tls_intermediate_certs": [],
                                                                                "tls_root_certs": []
                                                                            },
                                                                            "type": 0
                                                                        },
                                                                        "version": "0"
                                                                    }
                                                                },
                                                                "version": "0"
                                                            }
                                                        },
                                                        "mod_policy": "Admins",
                                                        "policies": {
                                                            "Admins": {
                                                                "mod_policy": "Admins",
                                                                "policy": {
                                                                    "type": 3,
                                                                    "value": {
                                                                        "rule": "MAJORITY",
                                                                        "sub_policy": "Admins"
                                                                    }
                                                                },
                                                                "version": "0"
                                                            },
                                                            "Readers": {
                                                                "mod_policy": "Admins",
                                                                "policy": {
                                                                    "type": 3,
                                                                    "value": {
                                                                        "rule": "ANY",
                                                                        "sub_policy": "Readers"
                                                                    }
                                                                },
                                                                "version": "0"
                                                            },
                                                            "Writers": {
                                                                "mod_policy": "Admins",
                                                                "policy": {
                                                                    "type": 3,
                                                                    "value": {
                                                                        "rule": "ANY",
                                                                        "sub_policy": "Writers"
                                                                    }
                                                                },
                                                                "version": "0"
                                                            }
                                                        },
                                                        "values": {},
                                                        "version": "1"
                                                    },
                                                    "Orderer": {
                                                        "groups": {
                                                            "OrdererOrg": {
                                                                "groups": {},
                                                                "mod_policy": "Admins",
                                                                "policies": {
                                                                    "Admins": {
                                                                        "mod_policy": "Admins",
                                                                        "policy": {
                                                                            "type": 1,
                                                                            "value": {
                                                                                "identities": [
                                                                                    {
                                                                                        "principal": {
                                                                                            "msp_identifier": "OrdererOrg",
                                                                                            "role": "ADMIN"
                                                                                        },
                                                                                        "principal_classification": "ROLE"
                                                                                    }
                                                                                ],
                                                                                "rule": {
                                                                                    "n_out_of": {
                                                                                        "n": 1,
                                                                                        "rules": [
                                                                                            {
                                                                                                "signed_by": 0
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                },
                                                                                "version": 0
                                                                            }
                                                                        },
                                                                        "version": "0"
                                                                    },
                                                                    "Readers": {
                                                                        "mod_policy": "Admins",
                                                                        "policy": {
                                                                            "type": 1,
                                                                            "value": {
                                                                                "identities": [
                                                                                    {
                                                                                        "principal": {
                                                                                            "msp_identifier": "OrdererOrg",
                                                                                            "role": "MEMBER"
                                                                                        },
                                                                                        "principal_classification": "ROLE"
                                                                                    }
                                                                                ],
                                                                                "rule": {
                                                                                    "n_out_of": {
                                                                                        "n": 1,
                                                                                        "rules": [
                                                                                            {
                                                                                                "signed_by": 0
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                },
                                                                                "version": 0
                                                                            }
                                                                        },
                                                                        "version": "0"
                                                                    },
                                                                    "Writers": {
                                                                        "mod_policy": "Admins",
                                                                        "policy": {
                                                                            "type": 1,
                                                                            "value": {
                                                                                "identities": [
                                                                                    {
                                                                                        "principal": {
                                                                                            "msp_identifier": "OrdererOrg",
                                                                                            "role": "MEMBER"
                                                                                        },
                                                                                        "principal_classification": "ROLE"
                                                                                    }
                                                                                ],
                                                                                "rule": {
                                                                                    "n_out_of": {
                                                                                        "n": 1,
                                                                                        "rules": [
                                                                                            {
                                                                                                "signed_by": 0
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                },
                                                                                "version": 0
                                                                            }
                                                                        },
                                                                        "version": "0"
                                                                    }
                                                                },
                                                                "values": {
                                                                    "MSP": {
                                                                        "mod_policy": "Admins",
                                                                        "value": {
                                                                            "config": {
                                                                                "admins": [
                                                                                    "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM4akNDQXBpZ0F3SUJBZ0lVQnBCRHozQUI4c2JWVXNYY3lwR3FXUXdObTZZd0NnWUlLb1pJemowRUF3SXcKUVRFUk1BOEdBMVVFQ2hNSVIzSmxlU0JKYm1NeEZUQVRCZ05WQkFzVERFZHlaWGtnVW05dmRDQkRRVEVWTUJNRwpBMVVFQXhNTVIzSmxlU0JTYjI5MElFTkJNQjRYRFRFNE1USXdOVEF4TXpBd01Gb1hEVEk0TVRJd01qQXhNelV3Ck1Gb3dnWWd4Q3pBSkJnTlZCQVlUQWxWVE1SY3dGUVlEVlFRSUV3NU9iM0owYUNCRFlYSnZiR2x1WVRFVU1CSUcKQTFVRUNoTUxTSGx3WlhKc1pXUm5aWEl4THpBTkJnTlZCQXNUQm1Oc2FXVnVkREFMQmdOVkJBc1RCR2R5WlhrdwpFUVlEVlFRTEV3cFBjbVJsY21WeVQzSm5NUmt3RndZRFZRUURFeEJQY21SbGNtVnlUM0puTFdGa2JXbHVNRmt3CkV3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFTUFtdWtnTWtRNHNLVGwvRERJbXd1S3JiODFZUkExcTUKcEYxTXhCaTVHdFZPajVVNUU3VVVJYWtORFhVVWlMbEliOTA1RDJnRGhlRXc5bjdKNUpMVkVLT0NBU1F3Z2dFZwpNQTRHQTFVZER3RUIvd1FFQXdJSGdEQU1CZ05WSFJNQkFmOEVBakFBTUIwR0ExVWREZ1FXQkJRMjFhcldvV3pMCkRRTWxUZFVGNGpTcGRaUmRkVEFmQmdOVkhTTUVHREFXZ0JTMjFjalo5WEdoVlhHdXB3b0E1Ryt6SmVPWG9EQTgKQmdOVkhSRUVOVEF6Z2pGeWRXNXVaWEl0TlRaaVpXUmxaamt0Y0hKdmFtVmpkQzA0TWpFNU56TTFMV052Ym1OMQpjbkpsYm5RdE1EZHNiR2gzTUlHQkJnZ3FBd1FGQmdjSUFRUjFleUpoZEhSeWN5STZleUpoWkcxcGJpSTZJblJ5CmRXVWlMQ0pvWmk1QlptWnBiR2xoZEdsdmJpSTZJbWR5WlhrdVQzSmtaWEpsY2s5eVp5SXNJbWhtTGtWdWNtOXMKYkcxbGJuUkpSQ0k2SWs5eVpHVnlaWEpQY21jdFlXUnRhVzRpTENKb1ppNVVlWEJsSWpvaVkyeHBaVzUwSW4xOQpNQW9HQ0NxR1NNNDlCQU1DQTBnQU1FVUNJUUNWaHZEcnF0RDhvR3Q4R2ZOMEN2Wms2RlptN1BETWlNZVIxdDE2ClRlWWFUd0lnZmhkUDZ0bm1oczd1ZVNxMmJYWU4rU0RGMGs0cmFZRHV4emhuZVhmdmJPbz0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo="
                                                                                ],
                                                                                "crypto_config": {
                                                                                    "identity_identifier_hash_function": "SHA256",
                                                                                    "signature_hash_family": "SHA2"
                                                                                },
                                                                                "fabric_node_ous": null,
                                                                                "intermediate_certs": [],
                                                                                "name": "OrdererOrg",
                                                                                "organizational_unit_identifiers": [],
                                                                                "revocation_list": [],
                                                                                "root_certs": [
                                                                                    "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJ5RENDQVcrZ0F3SUJBZ0lVYWNleU94Y1VBZ0cxUkdIdTZIb1QyYy9SZWNvd0NnWUlLb1pJemowRUF3SXcKUVRFUk1BOEdBMVVFQ2hNSVIzSmxlU0JKYm1NeEZUQVRCZ05WQkFzVERFZHlaWGtnVW05dmRDQkRRVEVWTUJNRwpBMVVFQXhNTVIzSmxlU0JTYjI5MElFTkJNQjRYRFRFNE1USXdOVEF4TWprd01Gb1hEVE16TVRJd01UQXhNamt3Ck1Gb3dRVEVSTUE4R0ExVUVDaE1JUjNKbGVTQkpibU14RlRBVEJnTlZCQXNUREVkeVpYa2dVbTl2ZENCRFFURVYKTUJNR0ExVUVBeE1NUjNKbGVTQlNiMjkwSUVOQk1Ga3dFd1lIS29aSXpqMENBUVlJS29aSXpqMERBUWNEUWdBRQpxZ0tqMlFLbFIxaWFGWWduU1VjR2NKWnJMZXRva1E2clVaWFZqU1hIME9vcitFRWRsdHJIZ1dyYWJqZ2VMK2lpClFVcEpRYzdlNzllUHNCYUdCYXg0bTZORk1FTXdEZ1lEVlIwUEFRSC9CQVFEQWdFR01CSUdBMVVkRXdFQi93UUkKTUFZQkFmOENBUUV3SFFZRFZSME9CQllFRkxiVnlObjFjYUZWY2E2bkNnRGtiN01sNDVlZ01Bb0dDQ3FHU000OQpCQU1DQTBjQU1FUUNJRC9kdFRWTmw0TjZjd3VJdzlQTm1jV002dkJkUnN2L2ZxMGJ2eHBLZ1lNV0FpQStsdFNECkYxY3A3VndLRTYzM2J1TUd4d2lvZUM1ckRXUFdIOUQ5WmNhNVVBPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo="
                                                                                ],
                                                                                "signing_identity": null,
                                                                                "tls_intermediate_certs": [],
                                                                                "tls_root_certs": []
                                                                            },
                                                                            "type": 0
                                                                        },
                                                                        "version": "0"
                                                                    }
                                                                },
                                                                "version": "0"
                                                            }
                                                        },
                                                        "mod_policy": "Admins",
                                                        "policies": {
                                                            "Admins": {
                                                                "mod_policy": "Admins",
                                                                "policy": {
                                                                    "type": 3,
                                                                    "value": {
                                                                        "rule": "MAJORITY",
                                                                        "sub_policy": "Admins"
                                                                    }
                                                                },
                                                                "version": "0"
                                                            },
                                                            "BlockValidation": {
                                                                "mod_policy": "Admins",
                                                                "policy": {
                                                                    "type": 3,
                                                                    "value": {
                                                                        "rule": "ANY",
                                                                        "sub_policy": "Writers"
                                                                    }
                                                                },
                                                                "version": "0"
                                                            },
                                                            "Readers": {
                                                                "mod_policy": "Admins",
                                                                "policy": {
                                                                    "type": 3,
                                                                    "value": {
                                                                        "rule": "ANY",
                                                                        "sub_policy": "Readers"
                                                                    }
                                                                },
                                                                "version": "0"
                                                            },
                                                            "Writers": {
                                                                "mod_policy": "Admins",
                                                                "policy": {
                                                                    "type": 3,
                                                                    "value": {
                                                                        "rule": "ANY",
                                                                        "sub_policy": "Writers"
                                                                    }
                                                                },
                                                                "version": "0"
                                                            }
                                                        },
                                                        "values": {
                                                            "BatchSize": {
                                                                "mod_policy": "Admins",
                                                                "value": {
                                                                    "absolute_max_bytes": 10485760,
                                                                    "max_message_count": 10,
                                                                    "preferred_max_bytes": 524288
                                                                },
                                                                "version": "0"
                                                            },
                                                            "BatchTimeout": {
                                                                "mod_policy": "Admins",
                                                                "value": {
                                                                    "timeout": "1s"
                                                                },
                                                                "version": "0"
                                                            },
                                                            "Capabilities": {
                                                                "mod_policy": "Admins",
                                                                "value": {
                                                                    "capabilities": {
                                                                        "V1_1": {}
                                                                    }
                                                                },
                                                                "version": "0"
                                                            },
                                                            "ChannelRestrictions": {
                                                                "mod_policy": "Admins",
                                                                "value": null,
                                                                "version": "0"
                                                            },
                                                            "ConsensusType": {
                                                                "mod_policy": "Admins",
                                                                "value": {
                                                                    "metadata": null,
                                                                    "type": "kafka"
                                                                },
                                                                "version": "0"
                                                            },
                                                            "KafkaBrokers": {
                                                                "mod_policy": "Admins",
                                                                "value": {
                                                                    "brokers": [
                                                                        "fabric-kafka-0.fabric-kafka-headless.fabric-ci-879.svc.cluster.local:9092"
                                                                    ]
                                                                },
                                                                "version": "0"
                                                            }
                                                        },
                                                        "version": "0"
                                                    }
                                                },
                                                "mod_policy": "Admins",
                                                "policies": {
                                                    "Admins": {
                                                        "mod_policy": "Admins",
                                                        "policy": {
                                                            "type": 3,
                                                            "value": {
                                                                "rule": "MAJORITY",
                                                                "sub_policy": "Admins"
                                                            }
                                                        },
                                                        "version": "0"
                                                    },
                                                    "Readers": {
                                                        "mod_policy": "Admins",
                                                        "policy": {
                                                            "type": 3,
                                                            "value": {
                                                                "rule": "ANY",
                                                                "sub_policy": "Readers"
                                                            }
                                                        },
                                                        "version": "0"
                                                    },
                                                    "Writers": {
                                                        "mod_policy": "Admins",
                                                        "policy": {
                                                            "type": 3,
                                                            "value": {
                                                                "rule": "ANY",
                                                                "sub_policy": "Writers"
                                                            }
                                                        },
                                                        "version": "0"
                                                    }
                                                },
                                                "values": {
                                                    "BlockDataHashingStructure": {
                                                        "mod_policy": "Admins",
                                                        "value": {
                                                            "width": 4294967295
                                                        },
                                                        "version": "0"
                                                    },
                                                    "Capabilities": {
                                                        "mod_policy": "Admins",
                                                        "value": {
                                                            "capabilities": {
                                                                "V1_3": {}
                                                            }
                                                        },
                                                        "version": "0"
                                                    },
                                                    "Consortium": {
                                                        "mod_policy": "Admins",
                                                        "value": {
                                                            "name": "GreyConsortium"
                                                        },
                                                        "version": "0"
                                                    },
                                                    "HashingAlgorithm": {
                                                        "mod_policy": "Admins",
                                                        "value": {
                                                            "name": "SHA256"
                                                        },
                                                        "version": "0"
                                                    },
                                                    "OrdererAddresses": {
                                                        "mod_policy": "/Channel/Orderer/Admins",
                                                        "value": {
                                                            "addresses": [
                                                                "fabric-orderers-0.fabric-orderers-headless.fabric-ci-879.svc.cluster.local:7050"
                                                            ]
                                                        },
                                                        "version": "0"
                                                    }
                                                },
                                                "version": "0"
                                            },
                                            "sequence": "1"
                                        },
                                        "last_update": {
                                            "payload": {
                                                "data": {
                                                    "config_update": {
                                                        "channel_id": "token-channel",
                                                        "isolated_data": {},
                                                        "read_set": {
                                                            "groups": {
                                                                "Application": {
                                                                    "groups": {
                                                                        "PeerOrg": {
                                                                            "groups": {},
                                                                            "mod_policy": "",
                                                                            "policies": {},
                                                                            "values": {},
                                                                            "version": "0"
                                                                        }
                                                                    },
                                                                    "mod_policy": "",
                                                                    "policies": {},
                                                                    "values": {},
                                                                    "version": "0"
                                                                }
                                                            },
                                                            "mod_policy": "",
                                                            "policies": {},
                                                            "values": {
                                                                "Consortium": {
                                                                    "mod_policy": "",
                                                                    "value": null,
                                                                    "version": "0"
                                                                }
                                                            },
                                                            "version": "0"
                                                        },
                                                        "write_set": {
                                                            "groups": {
                                                                "Application": {
                                                                    "groups": {
                                                                        "PeerOrg": {
                                                                            "groups": {},
                                                                            "mod_policy": "",
                                                                            "policies": {},
                                                                            "values": {},
                                                                            "version": "0"
                                                                        }
                                                                    },
                                                                    "mod_policy": "Admins",
                                                                    "policies": {
                                                                        "Admins": {
                                                                            "mod_policy": "Admins",
                                                                            "policy": {
                                                                                "type": 3,
                                                                                "value": {
                                                                                    "rule": "MAJORITY",
                                                                                    "sub_policy": "Admins"
                                                                                }
                                                                            },
                                                                            "version": "0"
                                                                        },
                                                                        "Readers": {
                                                                            "mod_policy": "Admins",
                                                                            "policy": {
                                                                                "type": 3,
                                                                                "value": {
                                                                                    "rule": "ANY",
                                                                                    "sub_policy": "Readers"
                                                                                }
                                                                            },
                                                                            "version": "0"
                                                                        },
                                                                        "Writers": {
                                                                            "mod_policy": "Admins",
                                                                            "policy": {
                                                                                "type": 3,
                                                                                "value": {
                                                                                    "rule": "ANY",
                                                                                    "sub_policy": "Writers"
                                                                                }
                                                                            },
                                                                            "version": "0"
                                                                        }
                                                                    },
                                                                    "values": {},
                                                                    "version": "1"
                                                                }
                                                            },
                                                            "mod_policy": "",
                                                            "policies": {},
                                                            "values": {
                                                                "Consortium": {
                                                                    "mod_policy": "",
                                                                    "value": {
                                                                        "name": "GreyConsortium"
                                                                    },
                                                                    "version": "0"
                                                                }
                                                            },
                                                            "version": "0"
                                                        }
                                                    },
                                                    "signatures": [
                                                        {
                                                            "signature": "MEUCIQDyZphXKeffXyVNSyLONx97o5aWXmGdlW+yg6ElG/W/pQIgER76j+wN+/cUejGiol30C8I4/VmF7jeHgnbqUe9Uong=",
                                                            "signature_header": {
                                                                "creator": {
                                                                    "id_bytes": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM1VENDQW91Z0F3SUJBZ0lVZGJiNGRIRmRHbzJsampNYkxBNnNmNnJTaEtvd0NnWUlLb1pJemowRUF3SXcKUVRFUk1BOEdBMVVFQ2hNSVIzSmxlU0JKYm1NeEZUQVRCZ05WQkFzVERFZHlaWGtnVW05dmRDQkRRVEVWTUJNRwpBMVVFQXhNTVIzSmxlU0JTYjI5MElFTkJNQjRYRFRFNE1USXdOVEF4TXpBd01Gb1hEVEk0TVRJd01qQXhNelV3Ck1Gb3dnWUl4Q3pBSkJnTlZCQVlUQWxWVE1SY3dGUVlEVlFRSUV3NU9iM0owYUNCRFlYSnZiR2x1WVRFVU1CSUcKQTFVRUNoTUxTSGx3WlhKc1pXUm5aWEl4TERBTkJnTlZCQXNUQm1Oc2FXVnVkREFMQmdOVkJBc1RCR2R5WlhrdwpEZ1lEVlFRTEV3ZFFaV1Z5VDNKbk1SWXdGQVlEVlFRREV3MVFaV1Z5VDNKbkxXRmtiV2x1TUZrd0V3WUhLb1pJCnpqMENBUVlJS29aSXpqMERBUWNEUWdBRUQrRCtoVTZuT001SW9MUHV6KzgzUGl4a3hPWldzbS8xRjVubDNOVDQKaDJTbWNJQ0dHTzc0ZSt6TDBrYkJpcjNuejdoc0dOWnNKSTFLVWd3cDkyWk54Nk9DQVIwd2dnRVpNQTRHQTFVZApEd0VCL3dRRUF3SUhnREFNQmdOVkhSTUJBZjhFQWpBQU1CMEdBMVVkRGdRV0JCVHNnYzFzRXNBcHFlSm9EQ2UvCjh4RHJnREcwcURBZkJnTlZIU01FR0RBV2dCUzIxY2paOVhHaFZYR3Vwd29BNUcrekplT1hvREE4QmdOVkhSRUUKTlRBemdqRnlkVzV1WlhJdE5UWmlaV1JsWmprdGNISnZhbVZqZEMwNE1qRTVOek0xTFdOdmJtTjFjbkpsYm5RdApNRGRzYkdoM01Ic0dDQ29EQkFVR0J3Z0JCRzk3SW1GMGRISnpJanA3SW1Ga2JXbHVJam9pZEhKMVpTSXNJbWhtCkxrRm1abWxzYVdGMGFXOXVJam9pWjNKbGVTNVFaV1Z5VDNKbklpd2lhR1l1Ulc1eWIyeHNiV1Z1ZEVsRUlqb2kKVUdWbGNrOXlaeTFoWkcxcGJpSXNJbWhtTGxSNWNHVWlPaUpqYkdsbGJuUWlmWDB3Q2dZSUtvWkl6ajBFQXdJRApTQUF3UlFJaEFLRmFFdnV2T1ZyZjBVSFh2MFRCdnFPZER3MVhBYXdVd0hpZDJJUXA4SmJSQWlBeFBOaWFVOXMrCmx5N1VGOGRjbUY2Qm5NWU1UTTM0aitDZ1RPeEcrNE1qSFE9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==",
                                                                    "mspid": "PeerOrg"
                                                                },
                                                                "nonce": "gHWJP4KlD7CHkrpa2FqYqUrPNndWbJy/"
                                                            }
                                                        }
                                                    ]
                                                },
                                                "header": {
                                                    "channel_header": {
                                                        "channel_id": "token-channel",
                                                        "epoch": "0",
                                                        "extension": null,
                                                        "timestamp": "2018-12-05T01:39:39Z",
                                                        "tls_cert_hash": null,
                                                        "tx_id": "",
                                                        "type": 2,
                                                        "version": 0
                                                    },
                                                    "signature_header": {
                                                        "creator": {
                                                            "id_bytes": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM1VENDQW91Z0F3SUJBZ0lVZGJiNGRIRmRHbzJsampNYkxBNnNmNnJTaEtvd0NnWUlLb1pJemowRUF3SXcKUVRFUk1BOEdBMVVFQ2hNSVIzSmxlU0JKYm1NeEZUQVRCZ05WQkFzVERFZHlaWGtnVW05dmRDQkRRVEVWTUJNRwpBMVVFQXhNTVIzSmxlU0JTYjI5MElFTkJNQjRYRFRFNE1USXdOVEF4TXpBd01Gb1hEVEk0TVRJd01qQXhNelV3Ck1Gb3dnWUl4Q3pBSkJnTlZCQVlUQWxWVE1SY3dGUVlEVlFRSUV3NU9iM0owYUNCRFlYSnZiR2x1WVRFVU1CSUcKQTFVRUNoTUxTSGx3WlhKc1pXUm5aWEl4TERBTkJnTlZCQXNUQm1Oc2FXVnVkREFMQmdOVkJBc1RCR2R5WlhrdwpEZ1lEVlFRTEV3ZFFaV1Z5VDNKbk1SWXdGQVlEVlFRREV3MVFaV1Z5VDNKbkxXRmtiV2x1TUZrd0V3WUhLb1pJCnpqMENBUVlJS29aSXpqMERBUWNEUWdBRUQrRCtoVTZuT001SW9MUHV6KzgzUGl4a3hPWldzbS8xRjVubDNOVDQKaDJTbWNJQ0dHTzc0ZSt6TDBrYkJpcjNuejdoc0dOWnNKSTFLVWd3cDkyWk54Nk9DQVIwd2dnRVpNQTRHQTFVZApEd0VCL3dRRUF3SUhnREFNQmdOVkhSTUJBZjhFQWpBQU1CMEdBMVVkRGdRV0JCVHNnYzFzRXNBcHFlSm9EQ2UvCjh4RHJnREcwcURBZkJnTlZIU01FR0RBV2dCUzIxY2paOVhHaFZYR3Vwd29BNUcrekplT1hvREE4QmdOVkhSRUUKTlRBemdqRnlkVzV1WlhJdE5UWmlaV1JsWmprdGNISnZhbVZqZEMwNE1qRTVOek0xTFdOdmJtTjFjbkpsYm5RdApNRGRzYkdoM01Ic0dDQ29EQkFVR0J3Z0JCRzk3SW1GMGRISnpJanA3SW1Ga2JXbHVJam9pZEhKMVpTSXNJbWhtCkxrRm1abWxzYVdGMGFXOXVJam9pWjNKbGVTNVFaV1Z5VDNKbklpd2lhR1l1Ulc1eWIyeHNiV1Z1ZEVsRUlqb2kKVUdWbGNrOXlaeTFoWkcxcGJpSXNJbWhtTGxSNWNHVWlPaUpqYkdsbGJuUWlmWDB3Q2dZSUtvWkl6ajBFQXdJRApTQUF3UlFJaEFLRmFFdnV2T1ZyZjBVSFh2MFRCdnFPZER3MVhBYXdVd0hpZDJJUXA4SmJSQWlBeFBOaWFVOXMrCmx5N1VGOGRjbUY2Qm5NWU1UTTM0aitDZ1RPeEcrNE1qSFE9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==",
                                                            "mspid": "PeerOrg"
                                                        },
                                                        "nonce": "Q+oLDJDE55Cz5E/8S8oL7Fc/0EEi44Up"
                                                    }
                                                }
                                            },
                                            "signature": "MEUCIQCYlkMT9XJciBVObquw5Ts+/1gS7e36dcM/p1hj4xC3hQIgWdPOXt+X52wCy7f7EWR4IYKTXY92ZTn18vR7fT5kdPg="
                                        }
                                    },
                                    "header": {
                                        "channel_header": {
                                            "channel_id": "token-channel",
                                            "epoch": "0",
                                            "extension": null,
                                            "timestamp": "2018-12-05T01:39:39Z",
                                            "tls_cert_hash": null,
                                            "tx_id": "",
                                            "type": 1,
                                            "version": 0
                                        },
                                        "signature_header": {
                                            "creator": {
                                                "id_bytes": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN3ekNDQW1xZ0F3SUJBZ0lVRENLTlhWUkhCNEEvOWhuQ1loM0d6azhJSTJVd0NnWUlLb1pJemowRUF3SXcKUVRFUk1BOEdBMVVFQ2hNSVIzSmxlU0JKYm1NeEZUQVRCZ05WQkFzVERFZHlaWGtnVW05dmRDQkRRVEVWTUJNRwpBMVVFQXhNTVIzSmxlU0JTYjI5MElFTkJNQjRYRFRFNE1USXdOVEF4TXpNd01Gb1hEVEk0TVRJd01qQXhNemd3Ck1Gb3dnWW94Q3pBSkJnTlZCQVlUQWxWVE1SY3dGUVlEVlFRSUV3NU9iM0owYUNCRFlYSnZiR2x1WVRFVU1CSUcKQTFVRUNoTUxTSGx3WlhKc1pXUm5aWEl4TURBT0JnTlZCQXNUQjI5eVpHVnlaWEl3Q3dZRFZRUUxFd1JuY21WNQpNQkVHQTFVRUN4TUtUM0prWlhKbGNrOXlaekVhTUJnR0ExVUVBeE1SWm1GaWNtbGpMVzl5WkdWeVpYSnpMVEF3CldUQVRCZ2NxaGtqT1BRSUJCZ2dxaGtqT1BRTUJCd05DQUFTcGRibVkxZERBUjJUMW9JdHVHM05UWk4wSWlkMGUKN1JjbTZtSFBSN3hybmxPSUpkUGxJQ21XTy9wcEY1emlkZzVVTDVYSTJUMFBTbG9zWDVwOWpqMy9vNEgxTUlIeQpNQTRHQTFVZER3RUIvd1FFQXdJSGdEQU1CZ05WSFJNQkFmOEVBakFBTUIwR0ExVWREZ1FXQkJTdU1tc2w2UndDClFYOTRwUXhqbXZKbUhuZkxaVEFmQmdOVkhTTUVHREFXZ0JTMjFjalo5WEdoVlhHdXB3b0E1Ryt6SmVPWG9EQWMKQmdOVkhSRUVGVEFUZ2hGbVlXSnlhV010YjNKa1pYSmxjbk10TURCMEJnZ3FBd1FGQmdjSUFRUm9leUpoZEhSeQpjeUk2ZXlKb1ppNUJabVpwYkdsaGRHbHZiaUk2SW1keVpYa3VUM0prWlhKbGNrOXlaeUlzSW1obUxrVnVjbTlzCmJHMWxiblJKUkNJNkltWmhZbkpwWXkxdmNtUmxjbVZ5Y3kwd0lpd2lhR1l1Vkhsd1pTSTZJbTl5WkdWeVpYSWkKZlgwd0NnWUlLb1pJemowRUF3SURSd0F3UkFJZ0F6cUhpdUI1UzJOczg5eXprMThTUHU2T0lOY3FEcDNkOE51Ywp2L096L3cwQ0lIWDllMm5YWkVsUjhJWjhjWlFEUFAwczd6UGF5M2NMMWpRV1RhUmYrd2dpCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K",
                                                "mspid": "OrdererOrg"
                                            },
                                            "nonce": "WBc0F22W2YOnQ2ObvggmaSMvuj/U6Qr1"
                                        }
                                    }
                                },
                                "signature": "MEQCIGR8o313MjfwimUUz2gRBggCJPchppERdI106kIHaeYmAiAPfYS4TDEYOaGYtn1R+8TDCx2yN2FIMOFzCo3YfBofMA=="
                            }
                        ]
                    },
                    "header": {
                        "data_hash": "6UxISj963ClZcbXKjaN3QtkPWvXwunJ6uWr7kFsTxRM=",
                        "number": "0",
                        "previous_hash": null
                    },
                    "metadata": {
                        "metadata": [
                            "",
                            "",
                            "",
                            ""
                        ]
                    }
                }
                    , {
	"data": {
		"data": [
			{
				"payload": {
					"data": {
						"actions": [
							{
								"header": {
									"creator": {
										"id_bytes": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM1VENDQW91Z0F3SUJBZ0lVZGJiNGRIRmRHbzJsampNYkxBNnNmNnJTaEtvd0NnWUlLb1pJemowRUF3SXcKUVRFUk1BOEdBMVVFQ2hNSVIzSmxlU0JKYm1NeEZUQVRCZ05WQkFzVERFZHlaWGtnVW05dmRDQkRRVEVWTUJNRwpBMVVFQXhNTVIzSmxlU0JTYjI5MElFTkJNQjRYRFRFNE1USXdOVEF4TXpBd01Gb1hEVEk0TVRJd01qQXhNelV3Ck1Gb3dnWUl4Q3pBSkJnTlZCQVlUQWxWVE1SY3dGUVlEVlFRSUV3NU9iM0owYUNCRFlYSnZiR2x1WVRFVU1CSUcKQTFVRUNoTUxTSGx3WlhKc1pXUm5aWEl4TERBTkJnTlZCQXNUQm1Oc2FXVnVkREFMQmdOVkJBc1RCR2R5WlhrdwpEZ1lEVlFRTEV3ZFFaV1Z5VDNKbk1SWXdGQVlEVlFRREV3MVFaV1Z5VDNKbkxXRmtiV2x1TUZrd0V3WUhLb1pJCnpqMENBUVlJS29aSXpqMERBUWNEUWdBRUQrRCtoVTZuT001SW9MUHV6KzgzUGl4a3hPWldzbS8xRjVubDNOVDQKaDJTbWNJQ0dHTzc0ZSt6TDBrYkJpcjNuejdoc0dOWnNKSTFLVWd3cDkyWk54Nk9DQVIwd2dnRVpNQTRHQTFVZApEd0VCL3dRRUF3SUhnREFNQmdOVkhSTUJBZjhFQWpBQU1CMEdBMVVkRGdRV0JCVHNnYzFzRXNBcHFlSm9EQ2UvCjh4RHJnREcwcURBZkJnTlZIU01FR0RBV2dCUzIxY2paOVhHaFZYR3Vwd29BNUcrekplT1hvREE4QmdOVkhSRUUKTlRBemdqRnlkVzV1WlhJdE5UWmlaV1JsWmprdGNISnZhbVZqZEMwNE1qRTVOek0xTFdOdmJtTjFjbkpsYm5RdApNRGRzYkdoM01Ic0dDQ29EQkFVR0J3Z0JCRzk3SW1GMGRISnpJanA3SW1Ga2JXbHVJam9pZEhKMVpTSXNJbWhtCkxrRm1abWxzYVdGMGFXOXVJam9pWjNKbGVTNVFaV1Z5VDNKbklpd2lhR1l1Ulc1eWIyeHNiV1Z1ZEVsRUlqb2kKVUdWbGNrOXlaeTFoWkcxcGJpSXNJbWhtTGxSNWNHVWlPaUpqYkdsbGJuUWlmWDB3Q2dZSUtvWkl6ajBFQXdJRApTQUF3UlFJaEFLRmFFdnV2T1ZyZjBVSFh2MFRCdnFPZER3MVhBYXdVd0hpZDJJUXA4SmJSQWlBeFBOaWFVOXMrCmx5N1VGOGRjbUY2Qm5NWU1UTTM0aitDZ1RPeEcrNE1qSFE9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==",
										"mspid": "PeerOrg"
									},
									"nonce": "OdUxKBwhkorgaHtCz1vHOQFJFm6Trw8i"
								},
								"payload": {
									"action": {
										"endorsements": [
											{
												"endorser": "CgdQZWVyT3JnEt0HLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNyakNDQWxXZ0F3SUJBZ0lVWnNZT3FHYW8ydTY0cktWVWNHRHJOemxscExVd0NnWUlLb1pJemowRUF3SXcKUVRFUk1BOEdBMVVFQ2hNSVIzSmxlU0JKYm1NeEZUQVRCZ05WQkFzVERFZHlaWGtnVW05dmRDQkRRVEVWTUJNRwpBMVVFQXhNTVIzSmxlU0JTYjI5MElFTkJNQjRYRFRFNE1USXdOVEF4TXpNd01Gb1hEVEk0TVRJd01qQXhNemd3Ck1Gb3dnWUV4Q3pBSkJnTlZCQVlUQWxWVE1SY3dGUVlEVlFRSUV3NU9iM0owYUNCRFlYSnZiR2x1WVRFVU1CSUcKQTFVRUNoTUxTSGx3WlhKc1pXUm5aWEl4S2pBTEJnTlZCQXNUQkhCbFpYSXdDd1lEVlFRTEV3Um5jbVY1TUE0RwpBMVVFQ3hNSFVHVmxjazl5WnpFWE1CVUdBMVVFQXhNT1ptRmljbWxqTFhCbFpYSnpMVEF3V1RBVEJnY3Foa2pPClBRSUJCZ2dxaGtqT1BRTUJCd05DQUFUeWF1UTBQMVdBUVNCVmFLVEc2TUlMM1YyaXBwNE1CTThFdTFVcm1VaTgKaFZKK2ozUmppRUVCTDg1Mm5pWHE4UW9TYWh0eDArQjVMdmtVTHBuODEvZWlvNEhwTUlIbU1BNEdBMVVkRHdFQgovd1FFQXdJSGdEQU1CZ05WSFJNQkFmOEVBakFBTUIwR0ExVWREZ1FXQkJRZkFWR1FHbTZjNHoreXNMb0lIQW1SCkpnem9RakFmQmdOVkhTTUVHREFXZ0JTMjFjalo5WEdoVlhHdXB3b0E1Ryt6SmVPWG9EQVpCZ05WSFJFRUVqQVEKZ2c1bVlXSnlhV010Y0dWbGNuTXRNREJyQmdncUF3UUZCZ2NJQVFSZmV5SmhkSFJ5Y3lJNmV5Sm9aaTVCWm1acApiR2xoZEdsdmJpSTZJbWR5WlhrdVVHVmxjazl5WnlJc0ltaG1Ma1Z1Y205c2JHMWxiblJKUkNJNkltWmhZbkpwCll5MXdaV1Z5Y3kwd0lpd2lhR1l1Vkhsd1pTSTZJbkJsWlhJaWZYMHdDZ1lJS29aSXpqMEVBd0lEUndBd1JBSWcKUjczQXRabmdsTlpZK3JMamFabEJIZVF2cWlJQ2JwN0s5Y01tZTJ2L1pyZ0NJRWFwVjZROE9CaHVGMHBYUTlkQwp0NVRoSGdBWnFvbHdwNlUveDFudjBaMWEKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=",
												"signature": "MEQCIEy7KFlEMWYXy/DJpqZJJbDXRm2vPGnQTUAQC9r8Xt22AiAwTDZif5uHFh5R2dbhzKPTN73MIg4tKBXiTwwA1O4dLQ=="
											}
										],
										"proposal_response_payload": {
											"extension": {
												"chaincode_id": {
													"name": "token-utxo",
													"path": "",
													"version": "0"
												},
												"events": null,
												"response": {
													"message": "",
													"payload": "MQ==",
													"status": 200
												},
												"results": {
													"data_model": "KV",
													"ns_rwset": [
														{
															"collection_hashed_rwset": [],
															"namespace": "lscc",
															"rwset": {
																"metadata_writes": [],
																"range_queries_info": [],
																"reads": [
																	{
																		"key": "token-utxo",
																		"version": {
																			"block_num": "2",
																			"tx_num": "0"
																		}
																	}
																],
																"writes": []
															}
														},
														{
															"collection_hashed_rwset": [],
															"namespace": "token-utxo",
															"rwset": {
																"metadata_writes": [],
																"range_queries_info": [
																	{
																		"end_key": "\u0000walletID~txID\u0000tokenState\u0000peva\u0000􏿿",
																		"itr_exhausted": true,
																		"raw_reads": {
																			"kv_reads": [
																				{
																					"key": "\u0000walletID~txID\u0000tokenState\u0000peva\u0000f47ec35bd4ba98fc1a84fd3c18b5802e4ebb453b86e357e012fef7c342e82dc7\u0000",
																					"version": {
																						"block_num": "33",
																						"tx_num": "0"
																					}
																				}
																			]
																		},
																		"start_key": "\u0000walletID~txID\u0000tokenState\u0000peva\u0000"
																	}
																],
																"reads": [
																	{
																		"key": "\u0000correlationId\u0000idempotency\u0000302-0\u0000",
																		"version": null
																	}
																],
																"writes": [
																	{
																		"is_delete": false,
																		"key": "\u0000correlationId\u0000idempotency\u0000302-0\u0000",
																		"value": "eyJSZXNwb25zZSI6Ik1RPT0iLCJTdGF0dXMiOjIwMH0="
																	},
																	{
																		"is_delete": true,
																		"key": "\u0000walletID~txID\u0000tokenState\u0000peva\u0000f47ec35bd4ba98fc1a84fd3c18b5802e4ebb453b86e357e012fef7c342e82dc7\u0000",
																		"value": null
																	}
																]
															}
														}
													]
												}
											},
											"proposal_hash": "rJKQVPQfqfspqytromgRbAC5GQFTualtLg0dmre3G1Y="
										}
									},
									"chaincode_proposal_payload": {
										"TransientMap": {},
										"input": {
											"chaincode_spec": {
												"chaincode_id": {
													"name": "token-utxo",
													"path": "",
													"version": ""
												},
												"input": {
													"args": [
														"cmF6ZQ==",
														"eyJTZW5kZXIiOiJwZXZhIiwiQW1vdW50IjoxfQ=="
													],
													"decorations": {}
												},
												"timeout": 0,
												"type": "GOLANG"
											}
										}
									}
								}
							}
						]
					},
					"header": {
						"channel_header": {
							"channel_id": "token-channel",
							"epoch": "0",
							"extension": "EgwSCnRva2VuLXV0eG8=",
							"timestamp": "2018-12-05T01:42:23.555527117Z",
							"tls_cert_hash": null,
							"tx_id": "8ee6febd9d12f97d5299e893dfed0802c5050aaf80381d7858c97dd39fba1c13",
							"type": 3,
							"version": 0
						},
						"signature_header": {
							"creator": {
								"id_bytes": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM1VENDQW91Z0F3SUJBZ0lVZGJiNGRIRmRHbzJsampNYkxBNnNmNnJTaEtvd0NnWUlLb1pJemowRUF3SXcKUVRFUk1BOEdBMVVFQ2hNSVIzSmxlU0JKYm1NeEZUQVRCZ05WQkFzVERFZHlaWGtnVW05dmRDQkRRVEVWTUJNRwpBMVVFQXhNTVIzSmxlU0JTYjI5MElFTkJNQjRYRFRFNE1USXdOVEF4TXpBd01Gb1hEVEk0TVRJd01qQXhNelV3Ck1Gb3dnWUl4Q3pBSkJnTlZCQVlUQWxWVE1SY3dGUVlEVlFRSUV3NU9iM0owYUNCRFlYSnZiR2x1WVRFVU1CSUcKQTFVRUNoTUxTSGx3WlhKc1pXUm5aWEl4TERBTkJnTlZCQXNUQm1Oc2FXVnVkREFMQmdOVkJBc1RCR2R5WlhrdwpEZ1lEVlFRTEV3ZFFaV1Z5VDNKbk1SWXdGQVlEVlFRREV3MVFaV1Z5VDNKbkxXRmtiV2x1TUZrd0V3WUhLb1pJCnpqMENBUVlJS29aSXpqMERBUWNEUWdBRUQrRCtoVTZuT001SW9MUHV6KzgzUGl4a3hPWldzbS8xRjVubDNOVDQKaDJTbWNJQ0dHTzc0ZSt6TDBrYkJpcjNuejdoc0dOWnNKSTFLVWd3cDkyWk54Nk9DQVIwd2dnRVpNQTRHQTFVZApEd0VCL3dRRUF3SUhnREFNQmdOVkhSTUJBZjhFQWpBQU1CMEdBMVVkRGdRV0JCVHNnYzFzRXNBcHFlSm9EQ2UvCjh4RHJnREcwcURBZkJnTlZIU01FR0RBV2dCUzIxY2paOVhHaFZYR3Vwd29BNUcrekplT1hvREE4QmdOVkhSRUUKTlRBemdqRnlkVzV1WlhJdE5UWmlaV1JsWmprdGNISnZhbVZqZEMwNE1qRTVOek0xTFdOdmJtTjFjbkpsYm5RdApNRGRzYkdoM01Ic0dDQ29EQkFVR0J3Z0JCRzk3SW1GMGRISnpJanA3SW1Ga2JXbHVJam9pZEhKMVpTSXNJbWhtCkxrRm1abWxzYVdGMGFXOXVJam9pWjNKbGVTNVFaV1Z5VDNKbklpd2lhR1l1Ulc1eWIyeHNiV1Z1ZEVsRUlqb2kKVUdWbGNrOXlaeTFoWkcxcGJpSXNJbWhtTGxSNWNHVWlPaUpqYkdsbGJuUWlmWDB3Q2dZSUtvWkl6ajBFQXdJRApTQUF3UlFJaEFLRmFFdnV2T1ZyZjBVSFh2MFRCdnFPZER3MVhBYXdVd0hpZDJJUXA4SmJSQWlBeFBOaWFVOXMrCmx5N1VGOGRjbUY2Qm5NWU1UTTM0aitDZ1RPeEcrNE1qSFE9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==",
								"mspid": "PeerOrg"
							},
							"nonce": "OdUxKBwhkorgaHtCz1vHOQFJFm6Trw8i"
						}
					}
				},
				"signature": "MEUCIQC+yWcvdrk9NEkEllZR8ubFMmuuEE5Tm/SFIsIfshA0tAIgX0028pFrzW37sI2Ogt1uodozQMAz+YITTvL3Jh4BZgU="
			}
		]
	},
	"header": {
		"data_hash": "hOXARd76bK3RcO1ly3vxToQnKfB57EZLNPpdYGZsCbo=",
		"number": "36",
		"previous_hash": "UvTeFEAEoT2kWbZg5pUH3YeNBmJe07JH41zn58C5Low="
	},
	"metadata": {
		"metadata": [
			"EvEICqUICogICgpPcmRlcmVyT3JnEvkHLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN3ekNDQW1xZ0F3SUJBZ0lVRENLTlhWUkhCNEEvOWhuQ1loM0d6azhJSTJVd0NnWUlLb1pJemowRUF3SXcKUVRFUk1BOEdBMVVFQ2hNSVIzSmxlU0JKYm1NeEZUQVRCZ05WQkFzVERFZHlaWGtnVW05dmRDQkRRVEVWTUJNRwpBMVVFQXhNTVIzSmxlU0JTYjI5MElFTkJNQjRYRFRFNE1USXdOVEF4TXpNd01Gb1hEVEk0TVRJd01qQXhNemd3Ck1Gb3dnWW94Q3pBSkJnTlZCQVlUQWxWVE1SY3dGUVlEVlFRSUV3NU9iM0owYUNCRFlYSnZiR2x1WVRFVU1CSUcKQTFVRUNoTUxTSGx3WlhKc1pXUm5aWEl4TURBT0JnTlZCQXNUQjI5eVpHVnlaWEl3Q3dZRFZRUUxFd1JuY21WNQpNQkVHQTFVRUN4TUtUM0prWlhKbGNrOXlaekVhTUJnR0ExVUVBeE1SWm1GaWNtbGpMVzl5WkdWeVpYSnpMVEF3CldUQVRCZ2NxaGtqT1BRSUJCZ2dxaGtqT1BRTUJCd05DQUFTcGRibVkxZERBUjJUMW9JdHVHM05UWk4wSWlkMGUKN1JjbTZtSFBSN3hybmxPSUpkUGxJQ21XTy9wcEY1emlkZzVVTDVYSTJUMFBTbG9zWDVwOWpqMy9vNEgxTUlIeQpNQTRHQTFVZER3RUIvd1FFQXdJSGdEQU1CZ05WSFJNQkFmOEVBakFBTUIwR0ExVWREZ1FXQkJTdU1tc2w2UndDClFYOTRwUXhqbXZKbUhuZkxaVEFmQmdOVkhTTUVHREFXZ0JTMjFjalo5WEdoVlhHdXB3b0E1Ryt6SmVPWG9EQWMKQmdOVkhSRUVGVEFUZ2hGbVlXSnlhV010YjNKa1pYSmxjbk10TURCMEJnZ3FBd1FGQmdjSUFRUm9leUpoZEhSeQpjeUk2ZXlKb1ppNUJabVpwYkdsaGRHbHZiaUk2SW1keVpYa3VUM0prWlhKbGNrOXlaeUlzSW1obUxrVnVjbTlzCmJHMWxiblJKUkNJNkltWmhZbkpwWXkxdmNtUmxjbVZ5Y3kwd0lpd2lhR1l1Vkhsd1pTSTZJbTl5WkdWeVpYSWkKZlgwd0NnWUlLb1pJemowRUF3SURSd0F3UkFJZ0F6cUhpdUI1UzJOczg5eXprMThTUHU2T0lOY3FEcDNkOE51Ywp2L096L3cwQ0lIWDllMm5YWkVsUjhJWjhjWlFEUFAwczd6UGF5M2NMMWpRV1RhUmYrd2dpCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0KEhjabDzbGNLwrLXixX5aDuSfN+TFMLFCu5cSRzBFAiEAuPupN5ENcQjQpVprytR/hl5QIazPpOentKkl68uqZcACIARO9H8NGDNZ8zrCB/x7K4fbuOU4U9uPBM9xdXGckpTE",
			"CgIIARLxCAqlCAqICAoKT3JkZXJlck9yZxL5By0tLS0tQkVHSU4gQ0VSVElGSUNBVEUtLS0tLQpNSUlDd3pDQ0FtcWdBd0lCQWdJVURDS05YVlJIQjRBLzlobkNZaDNHems4SUkyVXdDZ1lJS29aSXpqMEVBd0l3ClFURVJNQThHQTFVRUNoTUlSM0psZVNCSmJtTXhGVEFUQmdOVkJBc1RERWR5WlhrZ1VtOXZkQ0JEUVRFVk1CTUcKQTFVRUF4TU1SM0psZVNCU2IyOTBJRU5CTUI0WERURTRNVEl3TlRBeE16TXdNRm9YRFRJNE1USXdNakF4TXpndwpNRm93Z1lveEN6QUpCZ05WQkFZVEFsVlRNUmN3RlFZRFZRUUlFdzVPYjNKMGFDQkRZWEp2YkdsdVlURVVNQklHCkExVUVDaE1MU0hsd1pYSnNaV1JuWlhJeE1EQU9CZ05WQkFzVEIyOXlaR1Z5WlhJd0N3WURWUVFMRXdSbmNtVjUKTUJFR0ExVUVDeE1LVDNKa1pYSmxjazl5WnpFYU1CZ0dBMVVFQXhNUlptRmljbWxqTFc5eVpHVnlaWEp6TFRBdwpXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBU3BkYm1ZMWREQVIyVDFvSXR1RzNOVFpOMElpZDBlCjdSY202bUhQUjd4cm5sT0lKZFBsSUNtV08vcHBGNXppZGc1VUw1WEkyVDBQU2xvc1g1cDlqajMvbzRIMU1JSHkKTUE0R0ExVWREd0VCL3dRRUF3SUhnREFNQmdOVkhSTUJBZjhFQWpBQU1CMEdBMVVkRGdRV0JCU3VNbXNsNlJ3QwpRWDk0cFF4am12Sm1IbmZMWlRBZkJnTlZIU01FR0RBV2dCUzIxY2paOVhHaFZYR3Vwd29BNUcrekplT1hvREFjCkJnTlZIUkVFRlRBVGdoRm1ZV0p5YVdNdGIzSmtaWEpsY25NdE1EQjBCZ2dxQXdRRkJnY0lBUVJvZXlKaGRIUnkKY3lJNmV5Sm9aaTVCWm1acGJHbGhkR2x2YmlJNkltZHlaWGt1VDNKa1pYSmxjazl5WnlJc0ltaG1Ma1Z1Y205cwpiRzFsYm5SSlJDSTZJbVpoWW5KcFl5MXZjbVJsY21WeWN5MHdJaXdpYUdZdVZIbHdaU0k2SW05eVpHVnlaWElpCmZYMHdDZ1lJS29aSXpqMEVBd0lEUndBd1JBSWdBenFIaXVCNVMyTnM4OXl6azE4U1B1Nk9JTmNxRHAzZDhOdWMKdi9Pei93MENJSFg5ZTJuWFpFbFI4SVo4Y1pRRFBQMHM3elBheTNjTDFqUVdUYVJmK3dnaQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tChIYMbvv5qObl0m0BzHZS5zAPc3BF8psNoNrEkcwRQIhAOGyHGGr9fPSe7R//yy0zZdpSE7lB9lDzSvwnk3NxG0MAiBp8qKXwQOFEvtVR1aIur6UxOeGyeRSDYyaFd2Xu/HbAw==",
			"",
			"CgIITw=="
		]
	}
}
])
            )*/

        .then(handleErrors);
};

export const getWallets = (props) => {
    return fetch(`/wallets`, {
        method: "GET",
        headers: new Headers({
            Authorization: "Bearer " + props.token,
            "Content-Type": "application/json"
        })
    })
    .then(res => res.json())
    /*    .then(res =>
            ["naturesFinest", "theWave"]
        )*/
        .then(handleErrors);
};

export const getRoles = (props) => {
    return fetch(`/roles`, {
        method: "GET",
        headers: new Headers({
            Authorization: "Bearer " + props.token,
            "Content-Type": "application/json"
        })
    })
    .then(res => res.json())
    /*    .then(res =>
            ["businessOwner", "employee", "globalReadOnly", "greyAdmin", "readOnly"]
        )*/
        .then(handleErrors);
};

export const getUsersByBusiness = (props, businessId) => {
    return fetch(`/businesses/${businessId}/users`, {
        method: "GET",
        headers: new Headers({
            Authorization: "Bearer " + props.token,
            "Content-Type": "application/json"
        })
    })
    .then(res => res.json())
    /*    .then(res =>
            [{
                "username": "andy",
                "previousPassword": "",
                "password": "",
                "cognitoId": "5527a453-924f-44b2-bf06-47dae80e0519",
                "picture": "",
                "businesses": [{"name": "NatureFinest", "description": "Description of the business 1"}],
                "roles": [{"walletId": "naturesFinest", "role": "businessOwner"}],
                "globalRoles": [],
                "email": "andy@naturesfinest.com",
                "phoneNumber": "+1123456789",
                "firstName": "BusinessOwnerAndy",
                "lastName": "Andy",
                "address": "",
                "zipCode": "",
                "city": "",
                "position": "",
                "enabled": true
            }, {
                "username": "joel",
                "previousPassword": "",
                "password": "",
                "cognitoId": "c7bb5d70-0e5f-437f-b90b-f6dbb0daf9dd",
                "picture": "",
                "businesses": [{
                    "name": "TheWave",
                    "description": "Description of the business 2"
                }, {"name": "NatureFinest", "description": "Description of the business 1"}],
                "roles": [{"walletId": "naturesFinest", "role": "employee"}],
                "globalRoles": [],
                "email": "joel@naturefinest.com",
                "phoneNumber": "+1223456789",
                "firstName": "BTenderJoel",
                "lastName": "Joel",
                "address": "",
                "zipCode": "",
                "city": "",
                "position": "",
                "enabled": true
            }]
        )*/
        .then(handleErrors)
};

export const getUsers = (props) => {
    return fetch("/users", {
        method: "GET",
        headers: new Headers({
            Authorization: "Bearer " + props.token,
            "Content-Type": "application/json"
        })
    })
        .then(res => res.json())
        /*    .then(res =>
                [{
                    "username": "admin",
                    "previousPassword": "",
                    "password": "",
                    "cognitoId": "e414fd4b-41ec-474d-b9c9-60bfe63378d8",
                    "picture": "",
                    "businesses": [],
                    "roles": [],
                    "globalRoles": ["greyAdmin"],
                    "email": "",
                    "phoneNumber": "",
                    "firstName": "",
                    "lastName": "",
                    "address": "",
                    "zipCode": "",
                    "city": "",
                    "position": "",
                    "enabled": true
                }, {
                    "username": "andy",
                    "previousPassword": "",
                    "password": "",
                    "cognitoId": "5527a453-924f-44b2-bf06-47dae80e0519",
                    "picture": "",
                    "businesses": [{"name": "NatureFinest", "description": "Description of the business 1"}],
                    "roles": [{"walletId": "naturesFinest", "role": "businessOwner"}],
                    "globalRoles": [],
                    "email": "andy@naturesfinest.com",
                    "phoneNumber": "+1123456789",
                    "firstName": "BusinessOwnerAndy",
                    "lastName": "Andy",
                    "address": "",
                    "zipCode": "",
                    "city": "",
                    "position": "",
                    "enabled": true
                }, {
                    "username": "dan",
                    "previousPassword": "",
                    "password": "",
                    "cognitoId": "9f8d509c-ad52-454c-957a-f7f6b7967fa9",
                    "picture": "",
                    "businesses": [{"name": "TheWave", "description": "Description of the business 2"}],
                    "roles": [{"walletId": "naturesFinest", "role": "businessOwner"}, {
                        "walletId": "theWave",
                        "role": "employee"
                    }],
                    "globalRoles": [],
                    "email": "dan@naturefinestandthewave.com",
                    "phoneNumber": "+1423456789",
                    "firstName": "Dan",
                    "lastName": "EmployeeDan",
                    "address": "dan's address",
                    "zipCode": "",
                    "city": "",
                    "position": "",
                    "enabled": true
                }, {
                    "username": "joel",
                    "previousPassword": "",
                    "password": "",
                    "cognitoId": "c7bb5d70-0e5f-437f-b90b-f6dbb0daf9dd",
                    "picture": "",
                    "businesses": [{
                        "name": "TheWave",
                        "description": "Description of the business 2"
                    }, {"name": "NatureFinest", "description": "Description of the business 1"}],
                    "roles": [{"walletId": "naturesFinest", "role": "employee"}],
                    "globalRoles": [],
                    "email": "joel@naturefinest.com",
                    "phoneNumber": "+1223456789",
                    "firstName": "BTenderJoel",
                    "lastName": "Joel",
                    "address": "",
                    "zipCode": "",
                    "city": "",
                    "position": "",
                    "enabled": true
                }, {
                    "username": "zed",
                    "previousPassword": "",
                    "password": "",
                    "cognitoId": "3495e611-711d-4100-a1f8-c4a83eed147a",
                    "picture": "",
                    "businesses": [],
                    "roles": [],
                    "globalRoles": ["greyAdmin"],
                    "email": "zed@grey.com",
                    "phoneNumber": "+1323456789",
                    "firstName": "AdminZed",
                    "lastName": "Zed",
                    "address": "",
                    "zipCode": "",
                    "city": "",
                    "position": "",
                    "enabled": true
                }]
            )*/
        .then(handleErrors)
};

export const getBusinessesList = (props) => {
  return fetch("/businesses", {
    method: "GET",
    headers: new Headers({
      Authorization: "Bearer " + props.token,
      "Content-Type": "application/json"
    })
  })
   .then(res => res.json())
      // .then(res => [
      //      {"name": "NatureFinest", "id": "bid-1111", "walletID": "wid-9999"},
      //      {"name": "The Wave", "id": "bid-2222", "walletID": "wid-8888"}
      //  ])
   .then(handleErrors);
};

export const getUsersList = (props) => {
  return fetch("/users", {
    method: "GET",
    headers: new Headers({
      Authorization: "Bearer " + props.token,
      "Content-Type": "application/json"
    })
  })
   .then(res => res.json())
    //    .then(res => [
    // {
    //     "DisplayName":"",
    //     "Email":"dan-naturesfinest@greyinc.io",
    //     "PhoneNumber":"",
    //     "PhotoURL":"",
    //     "ProviderID":"firebase",
    //     "UID":"D8i1juiH2vg1prjSf2HFJPNwUaF3",
    //     "CustomClaims":{
    //     "BusinessRoles":{
    //         "Auditor":[
    //
    //         ],
    //             "Cashier":[
    //
    //         ],
    //             "Manager":[
    //             "q11TnOOyXHj9y72Uf0pf"
    //         ],
    //             "Owner":[
    //
    //         ]
    //     },
    //     "GlobalRole":"GreyBusinessUser"
    // },
    //     "Disabled":false,
    //     "EmailVerified":true,
    //     "ProviderUserInfo":[
    //     {
    //         "DisplayName":"",
    //         "Email":"dan-naturesfinest@greyinc.io",
    //         "PhoneNumber":"",
    //         "PhotoURL":"",
    //         "ProviderID":"password",
    //         "UID":"dan-naturesfinest@greyinc.io"
    //     }
    // ],
    //     "TokensValidAfterMillis":1552601833000,
    //     "UserMetadata":{
    //     "CreationTimestamp":1552597418327,
    //         "LastLogInTimestamp":1552601984162
    // }
    // },
    //
    //    ])
   .then(handleErrors);
};

export const createUser = (props, body) => {
  console.log("Called createUser from API.js");
  console.log("idToken: " , props.token);
  console.log("Body.Email::: " , props.email);
  console.log("PROPS RECEIVED: ", props);
  return fetch("/users", {
    method: 'POST',
    headers: new Headers ({
      'Authorization' : 'Bearer ' + props.token,
      "Content-type": "application/json; charset=UTF-8",
    }),
    body: JSON.stringify({
      email: body.email,
     })
  })
  .then(response => response.json())
  .then(parsedJSON => console.log(parsedJSON.results))
  .then(handleErrors)
};

export const getAchTransactions = (props) => {
    return fetch(`/token/transactions`, {
        method: "GET",
        headers: new Headers({
            Authorization: "Bearer " + props.token,
            "Content-Type": "application/json",
            "x-correlation-id": uuid(),
        })
    })
        .then(res => res.json())
        // .then(res => [
        //     {
        //         "data": {
        //             "type": "transactions",
        //             "attributes": {
        //                 "transaction-type": "debit",
        //                 "amount": 100,
        //                 "precision": 2,
        //                 "currency": "USD",
        //                 "memo": "Test Transaction"
        //             },
        //             "relationships": {
        //                 "profile": {
        //                     "data": {
        //                         "type": "profiles",
        //                         "id": "profile_id"
        //                     }
        //                 },
        //                 "account": {
        //                     "data": {
        //                         "type": "accounts",
        //                         "id": "account_id"
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // ])




        .then(handleErrors);
};