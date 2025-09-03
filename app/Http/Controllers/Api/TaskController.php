<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * Get all tasks for authenticated user
     */
    public function index(Request $request)
    {
        $tasks = Task::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($task) {
                return [
                    'id' => (string) $task->id,
                    'title' => $task->title,
                    'isCompleted' => $task->isCompleted,
                    'createdAt' => $task->created_at->toISOString(),
                ];
            });

        return response()->json($tasks);
    }

    /**
     * Create a new task
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $task = Task::create([
            'title' => $request->title,
            'isCompleted' => false,
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'id' => (string) $task->id,
            'title' => $task->title,
            'isCompleted' => $task->isCompleted,
            'createdAt' => $task->created_at->toISOString(),
        ], 201);
    }

    /**
     * Update a task
     */
    public function update(Request $request, Task $task)
    {
        // Ensure user can only update their own tasks
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'isCompleted' => 'sometimes|required|boolean',
        ]);

        $task->update($request->only(['title', 'isCompleted']));

        return response()->json([
            'id' => (string) $task->id,
            'title' => $task->title,
            'isCompleted' => $task->isCompleted,
            'updatedAt' => $task->updated_at->toISOString(),
        ]);
    }

    /**
     * Delete a task
     */
    public function destroy(Request $request, Task $task)
    {
        // Ensure user can only delete their own tasks
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully'
        ]);
    }
}
