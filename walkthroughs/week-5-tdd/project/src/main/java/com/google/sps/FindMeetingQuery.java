// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public final class FindMeetingQuery {
  /**
   * Given a collection of pre-existing events and a meeting request, this
   * will find a collection of possible meeting times.
   * 
   * @param events An unsorted collection of all events registered 
   *    in this application.
   * @param request A meeting request.
   * 
   * @return A collection of available times.
   */
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    Collection<TimeRange> suggestedTimeRanges = findTimeForMeetingRequest(events, request, true);

    if (suggestedTimeRanges.size() == 0 && request.getAttendees().size() != 0) {
      suggestedTimeRanges = findTimeForMeetingRequest(events, request, false);
    }

    return suggestedTimeRanges;
  }

  public Collection<TimeRange> findTimeForMeetingRequest(Collection<Event> events, MeetingRequest request, 
      boolean includeOptionalAttendees) {
    List<String> attendees = new ArrayList<>(request.getAttendees());

    if (includeOptionalAttendees) {
      attendees.addAll(request.getOptionalAttendees());
    }

    List<TimeRange> unavailableTimeRanges = getUnavailableTimes(events, attendees);
    List<TimeRange> suggestedTimeRanges = findAvailableTimeRanges(unavailableTimeRanges, request.getDuration());

    return suggestedTimeRanges;
  }

  /**
   * Given a collection of events and a collection of people, this
   * will find a collection of the time ranges when the people are busy.
   * 
   * @param events An unsorted collection of all events registered 
   *    in this application.
   * @param attendees A collection of people to consider when calculating
   *    busy time.
   * 
   * @return A list of time ranges for which anyone in the list of people are busy,
   *    sorted by start time.
   */
  private List<TimeRange> getUnavailableTimes(Collection<Event> events, Collection<String> attendees) {
    List<TimeRange> eventTimes = events
        .stream()
        .filter(event -> !areAttendeesInEvent(event, attendees))
        .map(event -> event.getWhen())
        .collect(Collectors.toList());

    List<TimeRange> unavailableTimes = mergeOverlappingTimeRanges(eventTimes);

    return unavailableTimes;
  }

  /**
   * Given an event and a list of people, this will determine
   * if any of the people are attendees for the event.
   * 
   * @param event Any event in the program.
   * @param attendees A collection of people.
   * 
   * @return Whether anyone in the collection of people are
   *    attendees in the event.
   */
  private boolean areAttendeesInEvent(Event event, Collection<String> attendees) {
    return Collections.disjoint(event.getAttendees(), attendees);
  }

  /**
   * Given a collection of time ranges, this will merge those that overlap.
   * 
   * @param timeRanges An unsorted collection of time ranges.
   * 
   * @return A list of merged time ranges, sorted by start time.
   */
  private List<TimeRange> mergeOverlappingTimeRanges(Collection<TimeRange> timeRanges) {
    List<TimeRange> sortedTimeRanges = timeRanges
        .stream()
        .sorted(TimeRange.ORDER_BY_START)
        .collect(Collectors.toList());
    ArrayList<TimeRange> mergedTimeRanges = new ArrayList<>();

    for (TimeRange timeRange : sortedTimeRanges) {
      if (mergedTimeRanges.size() == 0) {
        mergedTimeRanges.add(timeRange);
        continue;
      } 

      int lastIndex = mergedTimeRanges.size() - 1;
      TimeRange lastTimeRange = mergedTimeRanges.get(lastIndex);
      
      if (lastTimeRange.contains(timeRange)) {
        continue;
      } 
      
      if (lastTimeRange.overlaps(timeRange)) {
        mergedTimeRanges.set(lastIndex, TimeRange.fromStartEnd(lastTimeRange.start(), timeRange.end(), false));
        continue;
      } 
      
      mergedTimeRanges.add(timeRange);
    }

    return mergedTimeRanges;
  }

  /**
   * Given a list of times unavailable for meetings and
   * the length of a new event, this will find a list of time
   * ranges when the new event could happen.
   * 
   * @param unavailableTimeRanges A list of unavailable time ranges
   *    sorted by start time.
   * @param eventDuration The length of an event in minutes.
   * 
   * @return An list of time ranges when the new event could be
   *    scheduled, sorted by start time.
   */
  private List<TimeRange> findAvailableTimeRanges(List<TimeRange> unavailableTimeRanges, long eventDuration) {
    List<TimeRange> availableTimeRanges = new ArrayList<>();

    int start = TimeRange.START_OF_DAY;

    for (TimeRange timeRange : unavailableTimeRanges) {
      int end = timeRange.start();

      if (end - start >= eventDuration) {
        availableTimeRanges.add(TimeRange.fromStartEnd(start, end, false));
      }

      start = timeRange.end();
    }

    if (TimeRange.END_OF_DAY - start >= eventDuration) {
      availableTimeRanges.add(TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true));
    }

    return availableTimeRanges;
  }
}
