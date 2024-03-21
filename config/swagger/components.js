const securitySchemes = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
  },
  FacebookOAuth: {
    type: 'oauth2',
    flows: {
      implicit: {
        authorizationUrl: 'http://localhost:3000/login/facebook',
        scopes: {
          displayName: 'access user displayName',
          email: 'access user email'
        }
      }
    }
  },
  GoogleOAuth: {
    type: 'oauth2',
    flows: {
      implicit: {
        authorizationUrl: 'http://localhost:3000/login/google',
        scopes: {
          profile: 'access user profile data',
          email: 'access user email'
        }
      }
    }
  }
}

module.exports = {
  schemas: {
    signup: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'success'
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 46
            },
            name: {
              type: 'string',
              example: 'test'
            },
            email: {
              type: 'string',
              example: 'test@569'
            },
            updatedAt: {
              type: 'string',
              example: '2024-03-09 10:02:41'
            },
            createdAt: {
              type: 'string',
              example: '2024-03-09 10:02:41'
            }
          }
        }
      }
    },
    signin: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'success'
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            isTeacher: {
              type: 'boolean',
              example: 0
            },
            email: {
              type: 'string',
              example: 'user1@example.com'
            },
            token: {
              type: 'string',
              example: 'user token'
            }
          }
        }
      }
    },
    home: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'success'
        },
        data: {
          type: 'object',
          properties: {
            totalPages: {
              type: 'integer',
              example: 4
            },
            currentPage: {
              type: 'integer',
              example: 1
            },
            prev: {
              type: 'integer',
              example: 1
            },
            next: {
              type: 'integer',
              example: 2
            },
            pages: {
              type: 'array',
              items: {
                type: 'integer'
              }
            },
            categories: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Category'
              }
            },
            teachers: {
              type: 'array',
              items: {
                allOf: [
                  {
                    $ref: '#/components/schemas/Teacher'
                  },
                  {
                    type: 'object',
                    properties: {
                      teaching_categories: {
                        type: 'array',
                        items: {
                          allOf: [
                            {
                              $ref: '#/components/schemas/Teaching_category'
                            },
                            {
                              type: 'object',
                              properties: {
                                Category: {
                                  type: 'object',
                                  properties: {
                                    name: {
                                      type: 'string',
                                      example: '多益'
                                    }
                                  }
                                }
                              }
                            }
                          ]
                        }
                      },
                      ratingAverage: {
                        type: 'number',
                        example: 2.3
                      }
                    }
                  }
                ]
              }
            },
            students: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  studentId: {
                    type: 'integer',
                    example: 1
                  },
                  studyHours: {
                    type: 'number',
                    example: 7.5
                  },
                  User: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        example: 'huh'
                      },
                      nickname: {
                        type: 'string',
                        example: 'df'
                      },
                      avatar: {
                        type: 'string',
                        example: 'https://example.com'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    Student: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 1
        },
        name: {
          type: 'string',
          example: 'user-1'
        },
        email: {
          type: 'string',
          example: 'user1@example.com'
        },
        nickname: {
          type: 'string',
          example: 'testing'
        },
        avatar: {
          type: 'string',
          example: 'https://example.com'
        },
        selfIntro: {
          type: 'string',
          example: 'test'
        }
      }
    },
    Teacher: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 1
        },
        name: {
          type: 'string',
          example: 'user-1'
        },
        nation: {
          type: 'string',
          example: 'BG'
        },
        nickname: {
          type: 'string',
          example: 'testing'
        },
        avatar: {
          type: 'string',
          example: 'https://example.com'
        },
        teachStyle: {
          type: 'string',
          example: 'testing'
        },
        selfIntro: {
          type: 'string',
          example: 'test'
        }
      }
    },
    Course: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 1
        },
        teacherId: {
          type: 'integer',
          example: 1
        },
        category: {
          type: 'array',
          items: {
            type: 'string',
            example: '多益'
          }
        },
        name: {
          type: 'string',
          example: 'testing'
        },
        intro: {
          type: 'string',
          example: 'testing'
        },
        link: {
          type: 'string',
          example: 'https://example.com'
        },
        duration: {
          type: 'integer',
          example: 30
        },
        image: {
          type: 'string',
          example: 'https://example.com'
        },
        startAt: {
          type: 'string',
          example: '2024-03-09 10:02:41'
        }
      }
    },
    Registration: {
      type: 'object',
      properties: {
        studentId: {
          type: 'integer',
          example: 1
        },
        courseId: {
          type: 'integer',
          example: 1
        },
        rating: {
          type: 'integer',
          example: 1
        },
        comment: {
          type: 'string',
          example: 'testing'
        }
      }
    },
    Teaching_category: {
      type: 'object',
      properties: {
        categoryId: {
          type: 'integer',
          example: 1
        }
      }
    },
    Category: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 1
        },
        name: {
          type: 'string',
          example: '多益'
        }
      }
    },
    error: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error'
        },
        message: {
          type: 'string',
          example: 'error message'
        }
      }
    }
  },
  securitySchemes
}
