// TODO: Tileukhan, pls write all endpoints of Teams and Ratings
package kz.dreamteam.backend.controller;

@RestController
@RequestMapping("/teams_ratings")
public class TeamsRatingsController {

    @GetMapping("/get_all_teams") // get_all_teams
    public ResponseEntity<List<Teams>> get_all_teams() {
        // return Teams:  
        //      max_team_size, int
        //      leader_id, int
        //      other_connections_ids, List of Users
    }
    
    @GetMapping("/get_team") // get_team
    public ResponseEntity<Teams> get_team(team_id) {
        // return Team:  
        //      max_team_size, int
        //      leader_id, int
        //      other_connections_ids, List of Users
    }

    @PostMapping("/create_teammate_request") // create_teammate_request
    public ? create_teammate_request(user_id, team_id) {
        // INSERT INTO teammates (user_id, team_id, status=”pending”)
        // created_at is automatically set to CURRENT_TIMESTAMP
        // return 200, 400, 404, 500
    }


    @PutMapping("/delete_teammate_request") // delete_teammate_request
    public ? delete_teammate_request(user_id, team_id) {
        // 1) UPDATE teammates SET (finishedAt=CURRENT_TIMESTAMP, status=”deleted”)  ==> JUST Change the status, finished=current_timestamp
        // 2) if finished-started >= 2 weeks -> allowGiveRating=true
        // return 200, 400, 404, 500
    }


    @PutMapping("/update_teammate_request") // update_teammate_request
    public ? update_teammate_request(user_id, team_id, status=”accepted/rejected”) {
        if (status == rejected)
            // UPDATE teammates SET (status=rejected)  ==> JUST Change the status
        else if (status == accepted)
            // UPDATE teammates SET (status=accepted, createdAt)  ==> JUST Change the status, startedAt = current_timestamp

        // return 200, 400, 404, 500
    }


    @GetMapping("/check_if_user_already_in_team") // check_if_user_already_in_team
    public ? check_if_user_already_in_team(user_id) {
        return user.team_id != null
    }


    @GetMapping("/get_my_connections") // get_my_connections
    public ? get_my_connections(user_id) {
        return select user_id_B from connections where user_id_A == user_id
    }

    @PostMapping("/create_team") // create_team  -> (OK, team_id)
    public ? create_team(user_id, max_team_size, invited_connections []Users) { // на фронте не должен пускать больше max_team_size
        1) new_team_id = INSERT into teams (leader_id=user_id, max_team_size) 
        2) for user in Users:
            create_teammate_request(user_id, team_id)
    }


    @GetMapping("/check_team_members") // check_team_members   -> [{user_id: "", status: ""}]
    public ? check_team_members(team_id) {
        select user_id, status from TeammateRequests where team_id=team_id
    }

    @GetMapping("/get_my_team") // get_my_team   -> Teams
    public ? get_my_team(user_id) {
        selec * from Teams where team_id = (select team_id from Users where userid=user_id)
    }
    

    @GetMapping("/get_rating_status") // get_rating_status
    public ? get_rating_status(user_A_id, user_B_id) { // -> boolean
        select allowGiveRating from teammateRequests where user_A_id ==user_A_id and user_B_id=user_B_id
    }

    @PostMapping("/create_rating") // create_rating
    public ? create_rating(user_A_id, user_B_id, score, comment) { // -> 200, 400
        INSERT INTO ratings value(user_A_id, user_B_id, score, comment, created_at=current_timestamp)
    }

    @GetMapping("/get_rating") // get_rating
    public ? get_rating(user_A_id, user_B_id) { // -> score, comment, created_at
        SELECT score, comment, created_at FROM ratings where (user_A_id=user_A_id, user_B_id=user_B_id)
    }
}
