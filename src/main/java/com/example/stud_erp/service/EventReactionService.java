package com.example.stud_erp.service;

import com.example.stud_erp.entity.EventReaction;
import com.example.stud_erp.repository.EventReactionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class EventReactionService {

    @Autowired
    private EventReactionRepository repository;

    /* 🔥 SAVE / UPDATE */
    public void saveReaction(EventReaction dto) {

        EventReaction reaction = repository
                .findByEventIdAndStudentId(dto.getEventId(), dto.getStudentId())
                .orElse(new EventReaction());

        reaction.setEventId(dto.getEventId());
        reaction.setStudentId(dto.getStudentId());
        reaction.setStudentName(dto.getStudentName());
        reaction.setStudentImage(dto.getStudentImage());
        reaction.setType(dto.getType());

        repository.save(reaction);
    }
    /* 🔥 GET ALL REACTIONS BY EVENT */
    public List<EventReaction> getByEvent(Long eventId) {
        return repository.findByEventId(eventId);
    }

    /* 🔥 STATS (HOD ke liye) */
    public Map<String, Long> getStats(Long eventId) {

        List<EventReaction> list = repository.findByEventId(eventId);

        Map<String, Long> map = new HashMap<>();

        for (EventReaction r : list) {
            String key = r.getType();
            map.put(key, map.getOrDefault(key, 0L) + 1);
        }

        map.put("TOTAL", (long) list.size());

        return map;
    }
}