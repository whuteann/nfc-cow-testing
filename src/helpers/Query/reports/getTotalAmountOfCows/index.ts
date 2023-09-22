export const getTotalAmountOfCowsQuery = async (
  prisma,
  status,
  countryId,
  farmId,
  villageTownId,
  teamLeadId,
  supervisorId,
  coordinatorId,
  familyId,
  toDate,
  fromDate) => {

  let initialQuery: Array<any> = []

  if (status) {
    initialQuery.push({
      status: status
    });
  }


  if (countryId) {
    let countryQuery = {
      family: {
        is: {
          townVillage: {
            is: {
              district: {
                is: {
                  country: {
                    id: countryId
                  }
                },
              },
            },
          },
        },
      },
    }

    initialQuery.push(countryQuery);
  }

  if (farmId) {
    let farmQuery = {
      farmId: farmId
    }

    initialQuery.push(farmQuery);
  }

  if (villageTownId) {
    let villageTownQuery = {
      family: {
        is: {
          townVillage: {
            id: villageTownId
          },
        },
      },
    }

    initialQuery.push(villageTownQuery);
  }

  if (teamLeadId) {
    const supervisorIds = (await prisma.user.findMany({
      where: {
        teamLeadId: teamLeadId
      },
      select: {
        id: true
      }
    })).map((supervisor) => supervisor.id);

    const familyIds = (await prisma.family.findMany({
      where: {
        OR: [
          {
            coordinator: {
              is: {
                supervisorId: {
                  in: supervisorIds
                }
              }
            },
          },
          {
            supervisorId: {
              in: supervisorIds
            }
          }
        ]
      },
      select: {
        id: true
      }
    })).map((family) => family.id)

    const teamLeadQuery = {
      familyId: {
        in: familyIds
      }
    }

    initialQuery.push(teamLeadQuery);
  }

  if (supervisorId) {
    const familyIds = (await prisma.family.findMany({
      where: {
        OR: [
          {
            coordinator: {
              is: {
                supervisorId: {
                  in: [supervisorId]
                }
              }
            }
          },
          {
            supervisorId: {
              in: [supervisorId]
            }
          }
        ]
      },
      select: {
        id: true
      }
    })).map((family) => family.id)

    const supervisorQuery = {
      familyId: {
        in: familyIds
      }
    }

    initialQuery.push(supervisorQuery);
  }

  if (coordinatorId) {
    const familyIds = (await prisma.family.findMany({
      where: {
        coordinatorId: {
          in: [coordinatorId]
        }
      },
      select: {
        id: true
      }
    })).map((family) => family.id)

    const coordinatorQuery = {
      familyId: {
        in: familyIds
      }
    }

    initialQuery.push(coordinatorQuery);
  }

  if (familyId) {
    const familyQuery = {
      familyId: {
        in: [familyId]
      }
    }

    initialQuery.push(familyQuery);
  }

  if (toDate && fromDate) {
    const timeQuery = {
      OR: [
        {
          familySalesDate: {
            lte: new Date(toDate),
            gte: new Date(fromDate)
          }
        },
        {
          farmSalesDate: {
            lte: new Date(toDate),
            gte: new Date(fromDate)
          }
        }
      ]

    }

    initialQuery.push(timeQuery);
  }

  return {
    AND: initialQuery
  }
}

